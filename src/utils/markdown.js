import { marked } from 'marked'
import hljs from 'highlight.js'
// 导入代码高亮样式（支持暗色和亮色主题）
import 'highlight.js/styles/github-dark.css'

/**
 * 转义 HTML 标签，防止 XSS 攻击
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
  if (text == null || text === undefined) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}

/**
 * 安全地获取高亮后的代码字符串
 * @param {string} code - 原始代码
 * @param {string} lang - 语言类型
 * @returns {string} 高亮后的 HTML 字符串
 */
function getHighlightedCode(code, lang) {
  if (!code) return ''
  
  const codeStr = String(code)
  
  try {
    let result
    if (lang && hljs.getLanguage(lang)) {
      result = hljs.highlight(codeStr, { language: lang })
    } else {
      result = hljs.highlightAuto(codeStr)
    }
    
    // highlight.js 返回的对象结构：{ value: string, language: string, ... }
    // 确保 value 存在且是字符串
    if (result && result.value) {
      const value = result.value
      // 确保返回的是字符串
      if (typeof value === 'string') {
        return value
      }
      // 如果不是字符串，尝试转换
      return String(value)
    }
    
    // 如果 result 没有 value，返回转义后的代码
    return escapeHtml(codeStr)
  } catch (err) {
    console.warn('代码高亮失败:', err)
    // 高亮失败，返回转义后的代码
    return escapeHtml(codeStr)
  }
}

// 配置 marked 的基本选项
marked.setOptions({
  breaks: true, // 支持 GitHub 风格的换行
  gfm: true // 支持 GitHub 风格的 Markdown
})

// 自定义渲染器
marked.use({
  renderer: {
    // 代码块渲染
    code(code, infostring, escaped) {
      const lang = (infostring || '').trim() || ''
      const codeStr = String(code || '')
      
      // 获取高亮后的代码（已经是 HTML 格式）
      const highlightedCode = getHighlightedCode(codeStr, lang)
      
      // 确保 highlightedCode 是字符串
      const safeCode = String(highlightedCode || escapeHtml(codeStr))
      
      // 添加语言类名
      const langClass = lang ? ` language-${escapeHtml(lang)}` : ''
      
      // 返回代码块 HTML（黑色背景由 CSS 控制）
      return `<pre><code class="hljs${langClass}">${safeCode}</code></pre>\n`
    },
    // 行内代码
    codespan(code) {
      const codeStr = escapeHtml(String(code || ''))
      return `<code class="hljs">${codeStr}</code>`
    },
    // HTML 块渲染 - 将 HTML 标签转换为代码块显示（类似 Typora）
    html(html) {
      const htmlStr = String(html || '').trim()
      
      // 如果包含 HTML 标签，将其作为 HTML 代码块显示
      if (htmlStr && htmlStr.match(/<[^>]+>/)) {
        // 获取高亮后的 HTML 代码
        const highlightedCode = getHighlightedCode(htmlStr, 'html')
        const safeCode = String(highlightedCode || escapeHtml(htmlStr))
        return `<pre><code class="hljs language-html">${safeCode}</code></pre>\n`
      }
      
      // 如果不是 HTML 标签，转义显示
      return escapeHtml(htmlStr)
    }
  }
})

/**
 * 清理和验证 HTML，防止 XSS 攻击
 * @param {string} html - 需要清理的 HTML
 * @returns {string} 清理后的 HTML
 */
function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return ''
  
  // 移除危险的脚本标签和事件处理器
  // 注意：这是一个基础的安全措施，生产环境建议使用 DOMPurify 等专业库
  let safeHtml = html
    // 移除 script 标签及其内容
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // 移除 on* 事件处理器
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    // 移除 javascript: 协议
    .replace(/javascript:/gi, '')
    // 移除 data: 协议中的 javascript
    .replace(/data:text\/html/gi, '')
  
  return safeHtml
}

/**
 * 渲染 Markdown 为 HTML
 * @param {string} markdown - Markdown 文本
 * @returns {string} 渲染后的 HTML
 */
export function renderMarkdown(markdown) {
  if (!markdown) return ''
  
  // 输入验证：确保 markdown 是字符串
  if (typeof markdown !== 'string') {
    console.warn('renderMarkdown: 输入必须是字符串')
    return escapeHtml(String(markdown))
  }
  
  try {
    // 使用 marked 渲染 Markdown
    // 段落和 HTML 标签会在 renderer 中被转义
    const html = marked.parse(markdown)
    
    // 确保返回的是字符串
    if (typeof html !== 'string') {
      console.warn('renderMarkdown: marked.parse 返回的不是字符串')
      return escapeHtml(markdown)
    }
    
    // 清理 HTML，防止 XSS 攻击
    const safeHtml = sanitizeHtml(html)
    
    return safeHtml
  } catch (error) {
    console.error('Markdown 渲染错误:', error)
    // 如果渲染失败，返回转义后的原始文本
    return `<pre><code class="hljs">${escapeHtml(markdown)}</code></pre>`
  }
}

