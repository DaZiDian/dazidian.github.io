<template>
  <div class="markdown-renderer" :class="isDark ? 'dark' : 'light'">
    <template v-for="(part, index) in parsedParts" :key="index">
      <CodeBlock 
        v-if="part.type === 'code'" 
        :code="part.code" 
        :language="part.language"
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
  }
})

const { isDark } = useTheme()

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

// 解析 Markdown 并分离代码块
const parsedParts = computed(() => {
  if (!props.markdown || typeof props.markdown !== 'string') {
    return []
  }
  
  const parts = []
  
  try {
    // 使用 marked 的 lexer 解析 tokens
    const tokens = marked.lexer(props.markdown)
    
    // 调试：检查 tokens
    if (process.env.NODE_ENV === 'development') {
      console.log('Markdown tokens:', tokens)
    }
    
    // 创建渲染器用于渲染非代码块内容
    const renderer = new marked.Renderer()
    
    let htmlBuffer = ''
    
    for (const token of tokens) {
      if (token.type === 'code' && token.lang !== undefined) {
        // 如果之前有 HTML 内容，先保存
        if (htmlBuffer) {
          parts.push({
            type: 'html',
            html: sanitizeHtml(htmlBuffer)
          })
          htmlBuffer = ''
        }
        
        // 添加代码块，确保 code 是字符串
        let codeText = ''
        
        // 优先使用 token.text
        if (token.text != null) {
          if (typeof token.text === 'string') {
            codeText = token.text
          } else if (typeof token.text === 'object') {
            // 如果是对象，尝试提取文本内容
            if (token.text.raw) {
              codeText = String(token.text.raw)
            } else if (token.text.text) {
              codeText = String(token.text.text)
            } else {
              try {
                codeText = JSON.stringify(token.text, null, 2)
              } catch (e) {
                codeText = String(token.text)
              }
            }
          } else {
            codeText = String(token.text)
          }
        } else if (token.raw != null) {
          // 如果没有 text，尝试使用 raw（需要去除语言标识符部分）
          let rawText = typeof token.raw === 'string' ? token.raw : String(token.raw)
          // 移除开头的 ```语言标识符 和结尾的 ```
          rawText = rawText.replace(/^```[\w-]*\n?/, '').replace(/\n?```$/, '')
          codeText = rawText
        }
        
        // 确保语言是字符串
        let language = 'auto'
        if (token.lang != null) {
          if (typeof token.lang === 'string') {
            language = token.lang.trim() || 'auto'
          } else {
            language = String(token.lang).trim() || 'auto'
          }
        }
        
        // 调试：检查代码块数据
        if (process.env.NODE_ENV === 'development') {
          console.log('代码块数据:', { codeText, language, token })
        }
        
        parts.push({
          type: 'code',
          code: codeText,
          language: language
        })
      } else {
        // 渲染其他类型的 token
        try {
          const tokenHtml = renderer[token.type]?.(token)
          if (tokenHtml) {
            // 确保返回的是字符串
            const htmlStr = typeof tokenHtml === 'string' 
              ? tokenHtml 
              : (typeof tokenHtml === 'object' 
                ? JSON.stringify(tokenHtml) 
                : String(tokenHtml))
            htmlBuffer += htmlStr
          }
        } catch (err) {
          console.warn(`渲染 token 类型 ${token.type} 时出错:`, err)
          // 如果渲染失败，至少显示原始文本
          if (token.raw) {
            htmlBuffer += escapeHtml(String(token.raw))
          }
        }
      }
    }
    
    // 处理剩余的 HTML
    if (htmlBuffer) {
      parts.push({
        type: 'html',
        html: sanitizeHtml(htmlBuffer)
      })
    }
    
    // 如果没有解析到任何内容，使用原来的方法
    if (parts.length === 0) {
      const html = marked.parse(props.markdown)
      return [{
        type: 'html',
        html: sanitizeHtml(html)
      }]
    }
    
    return parts
  } catch (error) {
    console.error('Markdown 解析错误:', error)
    return [{
      type: 'html',
      html: `<pre><code class="hljs">${escapeHtml(props.markdown)}</code></pre>`
    }]
  }
})
</script>

<style scoped>
.markdown-renderer {
  @apply w-full;
}

.markdown-content {
  @apply prose prose-lg max-w-none;
}

/* 行内代码样式 */
.markdown-content :deep(:not(pre) > code) {
  @apply px-1.5 py-0.5 rounded;
  background-color: rgba(110, 118, 129, 0.4);
  font-size: 0.875em;
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* 隐藏原来的代码块（会被 CodeBlock 组件替换） */
.markdown-content :deep(pre[data-code-block]) {
  display: none;
}
</style>

