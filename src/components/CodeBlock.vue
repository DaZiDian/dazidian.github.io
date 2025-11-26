<template>
  <div class="code-block-wrapper" :class="isDark ? 'dark' : 'light'">
    <!-- 工具栏 -->
    <div class="code-block-header">
      <!-- 左上角：语言选择器或语言显示 -->
      <div class="code-block-lang-selector">
        <select 
          v-if="showLanguageSelector"
          v-model="selectedLang" 
          @change="handleLangChange"
          class="lang-select"
          :class="isDark ? 'dark' : 'light'"
        >
          <option value="auto">自动检测</option>
          <option v-for="lang in supportedLanguages" :key="lang" :value="lang">
            {{ lang }}
          </option>
        </select>
        <span v-else class="lang-display" :class="isDark ? 'dark' : 'light'">
          {{ displayLanguage }}
        </span>
      </div>
      
      <!-- 右上角：复制按钮 -->
      <button 
        @click="copyToClipboard"
        class="copy-button"
        :class="isDark ? 'dark' : 'light'"
        :title="copied ? '已复制！' : '复制代码'"
      >
        <svg v-if="!copied" class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/>
        </svg>
        <svg v-else class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="copy-text">{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    
    <!-- 横线分隔 -->
    <div class="code-block-divider" :class="isDark ? 'dark' : 'light'"></div>
    
    <!-- 代码内容区域 -->
    <div class="code-block-content">
      <!-- 行号 -->
      <div class="code-block-line-numbers" ref="lineNumbersRef">
        <span 
          v-for="n in lineCount" 
          :key="n" 
          class="line-number"
          :class="isDark ? 'dark' : 'light'"
        >
          {{ n }}
        </span>
      </div>
      
      <!-- 代码 -->
      <div class="code-block-code-wrapper" ref="codeWrapperRef">
        <pre class="code-block-pre"><code 
          ref="codeRef"
          :class="`hljs language-${selectedLang === 'auto' ? detectedLang : selectedLang}`"
          v-html="highlightedCode"
        ></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  code: {
    type: [String, Object],
    required: true,
    default: ''
  },
  language: {
    type: String,
    default: 'auto'
  },
  showLanguageSelector: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: false
  },
  codeBlockIndex: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['language-change'])

const { isDark } = useTheme()

// 支持的编程语言列表
const supportedLanguages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
  'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'scala',
  'html', 'css', 'scss', 'sass', 'less', 'json', 'xml', 'yaml',
  'sql', 'bash', 'shell', 'powershell', 'dockerfile', 'markdown',
  'vue', 'jsx', 'tsx', 'vue-html'
]

// 选中的语言
const selectedLang = ref(props.language || 'auto')
// 检测到的语言
const detectedLang = ref('')
// 高亮后的代码
const highlightedCode = ref('')
// 是否已复制
const copied = ref(false)
// 行数
const lineCount = ref(1)

// 显示的语言（用于只读模式）
const displayLanguage = computed(() => {
  if (selectedLang.value === 'auto') {
    return detectedLang.value || 'plaintext'
  }
  return selectedLang.value
})

// 代码包装器引用
const codeWrapperRef = ref(null)
const codeRef = ref(null)
const lineNumbersRef = ref(null)

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

// 高亮代码
function highlightCode(code, lang) {
  // 确保 code 是字符串，防止 Object 转换问题
  let codeStr = ''
  if (code == null || code === undefined) {
    codeStr = ''
  } else if (typeof code === 'string') {
    codeStr = code
  } else if (typeof code === 'object') {
    // 如果是对象，尝试转换为字符串
    try {
      codeStr = JSON.stringify(code, null, 2)
    } catch (e) {
      codeStr = String(code)
    }
  } else {
    codeStr = String(code)
  }
  
  // 计算行数（保留空行，使用原始代码）
  const lines = codeStr.split('\n')
  lineCount.value = Math.max(1, lines.length)
  
  // 如果指定了语言且 highlight.js 支持
  if (lang && lang !== 'auto' && hljs.getLanguage(lang)) {
    try {
      // 直接使用原始代码进行高亮，保留所有格式
      const result = hljs.highlight(codeStr, { language: lang })
      return result.value || escapeHtml(codeStr)
    } catch (err) {
      console.warn('代码高亮失败:', err)
      return escapeHtml(codeStr)
    }
  }
  
  // 自动检测语言
  if (codeStr) {
    try {
      const result = hljs.highlightAuto(codeStr)
      detectedLang.value = result.language || 'plaintext'
      return result.value || escapeHtml(codeStr)
    } catch (err) {
      return escapeHtml(codeStr)
    }
  }
  
  return escapeHtml(codeStr)
}

// 处理语言变化
function handleLangChange() {
  updateHighlight()
  
  // 如果是可编辑模式，通知父组件更新Markdown源码
  if (props.editable && props.codeBlockIndex >= 0) {
    emit('language-change', {
      index: props.codeBlockIndex,
      language: selectedLang.value === 'auto' ? detectedLang.value : selectedLang.value
    })
  }
}

// 更新高亮
function updateHighlight() {
  // 确保 code 是字符串
  let codeStr = ''
  if (props.code == null || props.code === undefined) {
    codeStr = ''
  } else if (typeof props.code === 'string') {
    codeStr = props.code
  } else if (typeof props.code === 'object') {
    // 如果是对象，尝试转换为字符串
    try {
      codeStr = JSON.stringify(props.code, null, 2)
    } catch (e) {
      codeStr = String(props.code)
    }
  } else {
    codeStr = String(props.code)
  }
  
  const lang = selectedLang.value === 'auto' ? detectedLang.value : selectedLang.value
  highlightedCode.value = highlightCode(codeStr, lang)
  
  // 同步滚动
  nextTick(() => {
    syncScroll()
  })
}

// 同步行号和代码的滚动
function syncScroll() {
  if (codeWrapperRef.value && lineNumbersRef.value) {
    codeWrapperRef.value.addEventListener('scroll', () => {
      lineNumbersRef.value.scrollTop = codeWrapperRef.value.scrollTop
    })
  }
}

// 复制到剪贴板
async function copyToClipboard() {
  try {
    // 确保获取的是字符串格式的代码
    let codeText = ''
    if (props.code == null || props.code === undefined) {
      codeText = ''
    } else if (typeof props.code === 'string') {
      codeText = props.code
    } else if (typeof props.code === 'object') {
      // 如果是对象，转换为格式化的 JSON
      try {
        codeText = JSON.stringify(props.code, null, 2)
      } catch (e) {
        codeText = String(props.code)
      }
    } else {
      codeText = String(props.code)
    }
    
    await navigator.clipboard.writeText(codeText)
    copied.value = true
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    try {
      let codeText = ''
      if (props.code == null || props.code === undefined) {
        codeText = ''
      } else if (typeof props.code === 'string') {
        codeText = props.code
      } else {
        codeText = String(props.code)
      }
      
      const textArea = document.createElement('textarea')
      textArea.value = codeText
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (e) {
      alert('复制失败，请手动复制')
    }
  }
}

// 监听代码变化
watch(() => props.code, () => {
  updateHighlight()
}, { immediate: true })

// 监听语言变化
watch(() => props.language, (newLang) => {
  if (newLang && newLang !== selectedLang.value) {
    selectedLang.value = newLang
    updateHighlight()
  }
})

onMounted(() => {
  updateHighlight()
  syncScroll()
})
</script>

<style scoped>
.code-block-wrapper {
  @apply rounded-lg overflow-hidden my-4;
  background-color: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-block-header {
  @apply flex items-center justify-between px-4 py-2;
  background-color: rgba(13, 17, 23, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code-block-lang-selector {
  @apply flex items-center;
}

.lang-select {
  @apply px-3 py-1 rounded text-sm font-medium outline-none transition-all;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.lang-select.dark {
  color: #c9d1d9;
}

.lang-select.dark:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.lang-select.light {
  color: #24292e;
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.lang-select.light:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.lang-display {
  @apply px-3 py-1 rounded text-sm font-medium;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  user-select: none;
}

.lang-display.dark {
  color: #c9d1d9;
}

.lang-display.light {
  color: #24292e;
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.copy-button {
  @apply flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-all;
  cursor: pointer;
}

.copy-button.dark {
  color: #c9d1d9;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.copy-button.dark:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.copy-button.light {
  color: #24292e;
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.copy-button.light:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.copy-icon {
  @apply w-4 h-4;
}

.copy-text {
  @apply text-xs;
}

.code-block-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
}

.code-block-divider.light {
  background-color: rgba(0, 0, 0, 0.1);
}

.code-block-content {
  @apply flex relative;
  max-height: 600px;
  overflow: auto;
  align-items: flex-start;
}

.code-block-line-numbers {
  @apply flex flex-col px-4 text-right select-none;
  background-color: rgba(13, 17, 23, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 50px;
  user-select: none;
  line-height: 1.6;
  padding-top: 1rem;
  padding-bottom: 1rem;
  flex-shrink: 0;
}

.code-block-line-numbers .line-number {
  @apply text-xs;
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.6;
  height: 1.6em;
  display: block;
  text-align: right;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.code-block-line-numbers .line-number.dark {
  color: #6e7681;
}

.code-block-line-numbers .line-number.light {
  color: #8b949e;
}

.code-block-code-wrapper {
  @apply flex-1 overflow-auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin: 0;
}

.code-block-pre {
  @apply m-0;
  background-color: transparent;
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #c9d1d9;
  padding: 0;
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0;
  border: none;
  border-radius: 0;
}

.code-block-pre code {
  @apply block;
  background-color: transparent !important;
  padding: 0;
  margin: 0;
  font-size: inherit;
  line-height: 1.6 !important;
  color: inherit;
  border: none;
  border-radius: 0;
}

/* 确保代码正常显示 */
.code-block-pre code :deep(*) {
  display: inline;
  line-height: 1.6 !important;
  margin: 0;
  padding: 0;
}

/* 确保代码行与行号对齐 */
.code-block-pre code :deep(br) {
  line-height: 1.6;
}

/* 自定义滚动条 */
.code-block-content::-webkit-scrollbar,
.code-block-code-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-block-content::-webkit-scrollbar-track,
.code-block-code-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.code-block-content::-webkit-scrollbar-thumb,
.code-block-code-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.code-block-content::-webkit-scrollbar-thumb:hover,
.code-block-code-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

