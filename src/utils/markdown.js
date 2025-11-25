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
  if (text == null) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
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
      
      // 确保 code 是字符串
      let codeStr = String(code || '')
      
      // 手动进行语法高亮（不使用 marked 的 highlight 选项，避免冲突）
      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(codeStr, { language: lang })
          // 确保 highlighted.value 是字符串
          if (highlighted && highlighted.value && typeof highlighted.value === 'string') {
            codeStr = highlighted.value
          } else {
            // 如果 value 不是字符串，转义原始代码
            codeStr = escapeHtml(codeStr)
          }
        } catch (err) {
          console.warn('代码高亮失败:', err)
          codeStr = escapeHtml(codeStr)
        }
      } else if (codeStr.trim()) {
        // 没有指定语言，尝试自动检测
        try {
          const highlighted = hljs.highlightAuto(codeStr)
          // 确保 highlighted.value 是字符串
          if (highlighted && highlighted.value && typeof highlighted.value === 'string') {
            codeStr = highlighted.value
          } else {
            // 如果 value 不是字符串，转义原始代码
            codeStr = escapeHtml(codeStr)
          }
        } catch (err) {
          codeStr = escapeHtml(codeStr)
        }
      } else {
        // 空代码，转义 HTML 标签
        codeStr = escapeHtml(codeStr)
      }
      
      // 最终确保 codeStr 是字符串
      codeStr = String(codeStr || '')
      
      // 添加语言类名
      const langClass = lang ? ` language-${escapeHtml(lang)}` : ''
      
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
      if (htmlStr.match(/<[^>]+>/)) {
        try {
          // 尝试进行 HTML 语法高亮
          const highlighted = hljs.highlight(htmlStr, { language: 'html' })
          // 确保 highlighted.value 是字符串
          let highlightedCode = ''
          if (highlighted && highlighted.value && typeof highlighted.value === 'string') {
            highlightedCode = highlighted.value
          } else {
            highlightedCode = escapeHtml(htmlStr)
          }
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
 * 渲染 Markdown 为 HTML
 * @param {string} markdown - Markdown 文本
 * @returns {string} 渲染后的 HTML
 */
export function renderMarkdown(markdown) {
  if (!markdown) return ''
  
  try {
    // 使用 marked 渲染 Markdown
    // 段落和 HTML 标签会在 renderer 中被转义
    const html = marked.parse(markdown)
    return html
  } catch (error) {
    console.error('Markdown 渲染错误:', error)
    // 如果渲染失败，返回转义后的原始文本
    return `<pre><code class="hljs">${escapeHtml(markdown)}</code></pre>`
  }
}

