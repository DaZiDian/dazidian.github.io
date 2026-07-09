<template>
  <div class="markdown-renderer" :class="isDark ? 'dark' : 'light'">
    <template v-for="(part, index) in parsedParts" :key="index">
      <CodeBlock 
        v-if="part.type === 'code'" 
        :code="part.code" 
        :language="part.language"
        :show-language-selector="showLanguageSelector"
        :editable="editable"
        :code-block-index="part.index"
        @language-change="handleCodeBlockLanguageChange"
      />
      <div v-else v-html="part.html" class="markdown-content"></div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import CodeBlock from './CodeBlock.vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  markdown: {
    type: String,
    default: ''
  },
  editable: {
    type: Boolean,
    default: false
  },
  showLanguageSelector: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['language-change'])

const { isDark } = useTheme()

// 处理代码块语言变化
function handleCodeBlockLanguageChange(event) {
  emit('language-change', event)
}

// 转义 HTML
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

// 清理 HTML
function sanitizeHtml(html) {
  if (!html) return ''
  
  // 确保 html 是字符串
  let htmlStr = ''
  if (typeof html === 'string') {
    htmlStr = html
  } else if (typeof html === 'object') {
    // 如果是对象，尝试转换为字符串
    try {
      htmlStr = JSON.stringify(html)
    } catch (e) {
      htmlStr = String(html)
    }
  } else {
    htmlStr = String(html)
  }
  
  let safeHtml = htmlStr
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
  
  return safeHtml
}

// 预处理 Markdown：将 HTML 标签转换为代码块
function preprocessMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return markdown
  }
  
  let processedMarkdown = markdown
  const replacements = []
  
  // 匹配所有 HTML 标签（包括单标签和双标签）
  // 匹配 <tag>...</tag> 或 <tag /> 格式
  const htmlTagRegex = /<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?(?:\/>|>[\s\S]*?<\/\1>)/gi
  
  let match
  while ((match = htmlTagRegex.exec(markdown)) !== null) {
    const fullMatch = match[0]
    const tagName = match[1].toLowerCase()
    const matchIndex = match.index
    
    // 检查是否已经在代码块中
    const beforeMatch = markdown.substring(0, matchIndex)
    const codeBlockCount = (beforeMatch.match(/```/g) || []).length
    if (codeBlockCount % 2 === 1) {
      // 在代码块中，跳过
      continue
    }
    
    // 检查是否在行内代码中
    const beforeLine = beforeMatch.split('\n').pop() || ''
    const backtickCount = (beforeLine.match(/`/g) || []).length
    if (backtickCount % 2 === 1) {
      // 在行内代码中，跳过
      continue
    }
    
    // 确定语言类型
    let language = 'html'
    if (tagName === 'script') {
      // 检查 script 标签中的类型
      const typeMatch = fullMatch.match(/type\s*=\s*["']([^"']+)["']/i)
      if (typeMatch) {
        const type = typeMatch[1].toLowerCase()
        if (type.includes('javascript') || type.includes('js') || type === 'text/javascript') {
          language = 'javascript'
        } else if (type.includes('typescript') || type.includes('ts')) {
          language = 'typescript'
        } else if (type.includes('json')) {
          language = 'json'
        }
      } else {
        language = 'javascript' // 默认 JavaScript
      }
    } else if (tagName === 'style') {
      language = 'css'
    } else if (tagName === 'svg') {
      language = 'xml'
    }
    
    // 获取前面的内容（换行和缩进）
    const lineStart = beforeMatch.lastIndexOf('\n')
    const beforeLineContent = lineStart >= 0 ? beforeMatch.substring(lineStart + 1) : beforeMatch
    const indent = beforeLineContent.match(/^[ \t]*/)?.[0] || ''
    const beforeNewline = lineStart >= 0 ? '\n' : (matchIndex === 0 ? '' : '\n')
    
    // 创建代码块
    const codeBlock = `${beforeNewline}${indent}\`\`\`${language}\n${indent}${fullMatch}\n${indent}\`\`\``
    replacements.push({
      start: matchIndex,
      end: matchIndex + fullMatch.length,
      replacement: codeBlock,
      original: fullMatch
    })
  }
  
  // 从后往前替换，避免索引偏移
  replacements.reverse().forEach(replacement => {
    processedMarkdown = processedMarkdown.substring(0, replacement.start) + 
                       replacement.replacement + 
                       processedMarkdown.substring(replacement.end)
  })
  
  return processedMarkdown
}

// 解析 Markdown 并分离代码块
const parsedParts = computed(() => {
  if (!props.markdown || typeof props.markdown !== 'string') {
    return []
  }
  
  const parts = []
  const codeBlockData = []
  
  try {
    // 预处理：将 HTML 标签转换为代码块
    const preprocessedMarkdown = preprocessMarkdown(props.markdown)
    
    // 使用 lexer 解析 tokens，提取代码块信息
    const tokens = marked.lexer(preprocessedMarkdown)
    
    // 递归收集代码块
    function extractCodeBlocks(tokens) {
      for (const token of tokens) {
        if (token.type === 'code' && token.lang !== undefined) {
          let codeText = ''
          if (token.text != null && typeof token.text === 'string') {
            codeText = token.text
          } else if (token.raw != null) {
            let rawText = typeof token.raw === 'string' ? token.raw : String(token.raw)
            rawText = rawText.replace(/^```[\w-]*\n?/, '').replace(/\n?```$/, '')
            codeText = rawText
          }
          
          let language = 'auto'
          if (token.lang != null) {
            language = typeof token.lang === 'string' ? token.lang.trim() : String(token.lang).trim()
            if (!language) language = 'auto'
          }
          
          codeBlockData.push({ code: codeText, language, index: codeBlockData.length })
        }
        
        // 递归处理嵌套
        if (token.tokens) extractCodeBlocks(token.tokens)
        if (token.items) {
          token.items.forEach(item => {
            if (item.tokens) extractCodeBlocks(item.tokens)
          })
        }
      }
    }
    
    extractCodeBlocks(tokens)
    
    // 创建自定义渲染器，将代码块替换为占位符
    const renderer = new marked.Renderer()
    let codeBlockIndex = 0
    
    renderer.code = function(code, infostring) {
      const lang = (infostring || '').trim() || 'auto'
      const placeholder = `__CODE_BLOCK_${codeBlockIndex++}__`
      return placeholder
    }
    
    // 处理 HTML 块，将 HTML 标签转换为代码块
    const originalHtml = renderer.html
    renderer.html = function(html) {
      const htmlStr = String(html || '').trim()
      
      // 如果包含 HTML 标签，将其作为 HTML 代码块显示
      if (htmlStr && htmlStr.match(/<[^>]+>/)) {
        // 提取 HTML 代码并添加到代码块数据中
        let language = 'html'
        const currentIndex = codeBlockData.length
        codeBlockData.push({ code: htmlStr, language, index: currentIndex })
        // 返回占位符，但需要确保索引正确
        return `__CODE_BLOCK_${currentIndex}__`
      }
      
      // 如果不是 HTML 标签，使用默认渲染或返回空
      if (originalHtml) {
        return originalHtml.call(this, html)
      }
      return ''
    }
    
    // 使用自定义渲染器解析（使用预处理后的 Markdown）
    const html = marked.parse(preprocessedMarkdown, { renderer })
    
    // 分割 HTML 并插入代码块组件
    const placeholders = html.match(/__CODE_BLOCK_\d+__/g) || []
    
    if (placeholders.length === 0) {
      // 没有代码块，直接返回
      return [{
        type: 'html',
        html: sanitizeHtml(html)
      }]
    }
    
    let lastIndex = 0
    placeholders.forEach((placeholder, index) => {
      const placeholderIndex = html.indexOf(placeholder, lastIndex)
      const codeBlock = codeBlockData[index]
      
      // 添加占位符前的 HTML
      if (placeholderIndex > lastIndex) {
        const htmlPart = html.substring(lastIndex, placeholderIndex)
        if (htmlPart.trim()) {
          parts.push({
            type: 'html',
            html: sanitizeHtml(htmlPart)
          })
        }
      }
      
      // 添加代码块组件
      if (codeBlock) {
        parts.push({
          type: 'code',
          code: codeBlock.code,
          language: codeBlock.language,
          index: codeBlock.index
        })
      }
      
      lastIndex = placeholderIndex + placeholder.length
    })
    
    // 添加剩余的 HTML
    if (lastIndex < html.length) {
      const htmlPart = html.substring(lastIndex)
      if (htmlPart.trim()) {
        parts.push({
          type: 'html',
          html: sanitizeHtml(htmlPart)
        })
      }
    }
    
    return parts.length > 0 ? parts : [{
      type: 'html',
      html: sanitizeHtml(html)
    }]
  } catch (error) {
    console.error('Markdown 解析错误:', error)
    try {
      const html = marked.parse(props.markdown)
      return [{
        type: 'html',
        html: sanitizeHtml(html)
      }]
    } catch (parseError) {
      return [{
        type: 'html',
        html: `<pre><code class="hljs">${escapeHtml(props.markdown)}</code></pre>`
      }]
    }
  }
})
</script>

<style scoped>
.markdown-renderer {
  width: 100%;
}

.markdown-content {
  max-width: none;
  line-height: 1.75;
}

/* 标题样式 */
.markdown-content :deep(h1) {
  font-size: 2.25em;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  line-height: 1.6;
}

.markdown-content :deep(h4) {
  font-size: 1.125em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5555556;
}

.markdown-content :deep(h5) {
  font-size: 1em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5555556;
}

.markdown-content :deep(h6) {
  font-size: 0.875em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5555556;
}

/* 段落 */
.markdown-content :deep(p) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

/* 列表 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.markdown-content :deep(li) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.markdown-content :deep(ul > li) {
  position: relative;
  padding-left: 0.375em;
  list-style-type: disc;
}

.markdown-content :deep(ol > li) {
  position: relative;
  padding-left: 0.375em;
  list-style-type: decimal;
}

/* 引用 */
.markdown-content :deep(blockquote) {
  font-weight: 500;
  font-style: italic;
  color: inherit;
  border-left-width: 0.25rem;
  border-left-color: rgba(122, 162, 247, 0.5);
  quotes: "\201C""\201D""\2018""\2019";
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}

/* 链接 */
.markdown-content :deep(a) {
  color: #7aa2f7;
  text-decoration: underline;
  font-weight: 500;
}

.markdown-content :deep(a:hover) {
  color: #7dcfff;
}

/* 图片 */
.markdown-content :deep(img) {
  margin-top: 2em;
  margin-bottom: 2em;
  border-radius: 0.5rem;
}

/* 表格 */
.markdown-content :deep(table) {
  width: 100%;
  table-layout: auto;
  text-align: left;
  margin-top: 2em;
  margin-bottom: 2em;
  font-size: 0.875em;
  line-height: 1.7142857;
}

.markdown-content :deep(thead) {
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.markdown-content :deep(thead th) {
  color: inherit;
  font-weight: 600;
  vertical-align: bottom;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}

.markdown-content :deep(tbody tr) {
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.markdown-content :deep(tbody td) {
  vertical-align: baseline;
  padding-top: 0.5714286em;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}

/* 水平线 */
.markdown-content :deep(hr) {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-width: 1px;
  margin-top: 3em;
  margin-bottom: 3em;
}

/* 强调 */
.markdown-content :deep(strong) {
  font-weight: 600;
}

.markdown-content :deep(em) {
  font-style: italic;
}

/* 行内代码样式 */
.markdown-content :deep(:not(pre) > code) {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background-color: rgba(110, 118, 129, 0.4);
  font-size: 0.875em;
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* 隐藏原来的代码块（会被 CodeBlock 组件替换） */
.markdown-content :deep(pre[data-code-block]) {
  display: none;
}
</style>

