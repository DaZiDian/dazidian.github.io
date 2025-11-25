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
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}

// 配置 marked 的代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(code, { language: lang })
        return highlighted.value
      } catch (err) {
        console.warn('代码高亮失败:', err)
      }
    }
    // 如果没有指定语言或语言不支持，尝试自动检测
    try {
      const highlighted = hljs.highlightAuto(code)
      return highlighted.value
    } catch (err) {
      // 如果自动检测也失败，返回转义后的代码
      return escapeHtml(code)
    }
  },
  breaks: true, // 支持 GitHub 风格的换行
  gfm: true // 支持 GitHub 风格的 Markdown
})

// 自定义代码块渲染器，确保 HTML 标签被正确转义
marked.use({
  renderer: {
    code(code, infostring, escaped) {
      const lang = (infostring || '').trim() || ''
      
      // 如果代码已经被高亮处理过（escaped = true），直接使用
      // 否则需要转义 HTML 标签
      if (!escaped) {
        code = escapeHtml(code)
      }
      
      // 添加语言类名
      const langClass = lang ? ` language-${escapeHtml(lang)}` : ''
      
      return `<pre><code class="hljs${langClass}">${code}</code></pre>\n`
    },
    // 行内代码
    codespan(code) {
      return `<code class="hljs">${escapeHtml(code)}</code>`
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
    const html = marked.parse(markdown)
    return html
  } catch (error) {
    console.error('Markdown 渲染错误:', error)
    // 如果渲染失败，返回转义后的原始文本
    return `<pre><code class="hljs">${escapeHtml(markdown)}</code></pre>`
  }
}

