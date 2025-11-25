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
  gfm: true, // 支持 GitHub 风格的 Markdown
  sanitize: false, // 不自动转义 HTML（我们手动处理）
  silent: false
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
          codeStr = highlighted.value || escapeHtml(codeStr)
        } catch (err) {
          console.warn('代码高亮失败:', err)
          codeStr = escapeHtml(codeStr)
        }
      } else if (codeStr.trim()) {
        // 没有指定语言，尝试自动检测
        try {
          const highlighted = hljs.highlightAuto(codeStr)
          codeStr = highlighted.value || escapeHtml(codeStr)
        } catch (err) {
          codeStr = escapeHtml(codeStr)
        }
      } else {
        // 空代码，转义 HTML 标签
        codeStr = escapeHtml(codeStr)
      }
      
      // 添加语言类名
      const langClass = lang ? ` language-${escapeHtml(lang)}` : ''
      
      return `<pre><code class="hljs${langClass}">${codeStr}</code></pre>\n`
    },
    // 行内代码
    codespan(code) {
      const codeStr = escapeHtml(String(code || ''))
      return `<code class="hljs">${codeStr}</code>`
    },
    // 段落渲染 - 转义段落中的原始 HTML 标签（但保留已转换的 Markdown 元素）
    paragraph(text) {
      // text 可能包含已转换的 Markdown 元素（如链接、图片等）
      // 我们需要转义原始的 HTML 标签，但保留已转换的 HTML
      // 使用正则匹配并转义未转义的 HTML 标签
      const escapedText = text.replace(/<(?![a-z]+\s|[/!])/gi, '&lt;').replace(/(?<![a-z"'])>/gi, '&gt;')
      // 但上面的方法可能不够精确，让我们使用更安全的方法：
      // 只转义明显的 HTML 标签（如 <script>, <div> 等），但保留已转换的 Markdown HTML
      // 实际上，marked 已经处理了 Markdown 语法，text 中的 HTML 标签应该是用户输入的原始 HTML
      // 为了安全，我们转义所有看起来像 HTML 标签的内容（除了已转换的 Markdown 元素）
      const safeText = text.replace(/(<)(?!\/?(?:a|img|strong|em|code|pre|br|hr|blockquote|ul|ol|li|h[1-6]|p)\b)[^>]*(>)/gi, (match) => {
        // 转义非 Markdown 转换的 HTML 标签
        return escapeHtml(match)
      })
      return `<p>${safeText}</p>\n`
    },
    // HTML 块渲染 - 转义 HTML 标签以显示为文本
    html(html) {
      return escapeHtml(html)
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

