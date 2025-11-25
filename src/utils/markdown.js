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

// 配置 marked，使用标准的 highlight 选项
marked.setOptions({
  highlight: function(code, lang) {
    // 确保 code 是字符串
    const codeStr = String(code || '')
    
    // 如果指定了语言且 highlight.js 支持
    if (lang && hljs.getLanguage(lang)) {
      try {
        const result = hljs.highlight(codeStr, { language: lang })
        // highlight.js 返回 { value: string, language: string, ... }
        // value 是已经高亮后的 HTML 字符串
        return result.value || escapeHtml(codeStr)
      } catch (err) {
        console.warn('代码高亮失败:', err)
        return escapeHtml(codeStr)
      }
    }
    
    // 如果没有指定语言或语言不支持，尝试自动检测
    if (codeStr.trim()) {
      try {
        const result = hljs.highlightAuto(codeStr)
        return result.value || escapeHtml(codeStr)
      } catch (err) {
        return escapeHtml(codeStr)
      }
    }
    
    // 空代码，返回转义后的代码
    return escapeHtml(codeStr)
  },
  langPrefix: 'hljs language-', // 为代码块添加类名前缀
  breaks: true, // 支持 GitHub 风格的换行
  gfm: true // 支持 GitHub 风格的 Markdown
})

// 自定义渲染器
marked.use({
  renderer: {
    // 代码块渲染 - marked 已经通过 highlight 选项处理了高亮
    code(code, infostring, escaped) {
      const lang = (infostring || '').trim() || ''
      
      // code 参数已经是高亮后的 HTML 字符串（由 highlight 选项处理）
      // escaped 参数表示代码是否已经被转义/高亮
      let codeStr = String(code || '')
      
      // 如果没有被高亮（escaped = false），转义 HTML
      if (!escaped) {
        codeStr = escapeHtml(codeStr)
      }
      
      // 添加语言类名
      const langClass = lang ? ` language-${escapeHtml(lang)}` : ''
      
      // 返回代码块 HTML（黑色背景由 CSS 控制）
      return `<pre><code class="hljs${langClass}">${codeStr}</code></pre>\n`
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
        try {
          // 使用 highlight.js 高亮 HTML 代码
          const result = hljs.highlight(htmlStr, { language: 'html' })
          const highlightedCode = result.value || escapeHtml(htmlStr)
          return `<pre><code class="hljs language-html">${highlightedCode}</code></pre>\n`
        } catch (err) {
          // 高亮失败，转义后显示
          return `<pre><code class="hljs language-html">${escapeHtml(htmlStr)}</code></pre>\n`
        }
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

