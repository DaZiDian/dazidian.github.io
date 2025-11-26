<template>
  <div class="glass-effect rounded-3xl p-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold transition-colors" 
          :class="isDark ? 'text-white' : 'text-gray-800'">
        {{ post ? '编辑文章' : '写新文章' }}
      </h2>
      <div class="flex gap-2">
        <button 
          @click="$emit('cancel')"
          class="px-4 py-2 rounded-lg border font-medium transition-all"
          :class="isDark 
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
        >
          取消
        </button>
        <button 
          @click="saveDraft"
          :disabled="isSaving"
          class="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
          :class="isDark 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
        >
          {{ isSaving ? '保存中...' : '保存草稿' }}
        </button>
        <button 
          @click="publish"
          :disabled="isSaving"
          class="px-4 py-2 rounded-lg font-medium text-white transition-all disabled:opacity-50"
          :class="isDark 
            ? 'bg-tokyo-night-blue hover:bg-tokyo-night-blue0' 
            : 'bg-blue-600 hover:bg-blue-700'"
        >
          {{ isSaving ? '发布中...' : '发布文章' }}
        </button>
      </div>
    </div>

    <form @submit.prevent="publish" class="space-y-6">
      <!-- 文章标题 -->
      <div>
        <label class="block text-sm font-medium mb-2 transition-colors" 
               :class="isDark ? 'text-white' : 'text-gray-800'">
          文章标题 *
        </label>
        <input 
          type="text" 
          v-model="formData.title"
          required
          placeholder="输入文章标题"
          class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          :class="isDark 
            ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
        />
      </div>

      <!-- 文章别名 -->
      <div>
        <label class="block text-sm font-medium mb-2 transition-colors" 
               :class="isDark ? 'text-white' : 'text-gray-800'">
          文章别名 (URL) *
        </label>
        <input 
          type="text" 
          v-model="formData.slug"
          required
          placeholder="article-url-slug"
          class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          :class="isDark 
            ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
        />
      </div>

      <!-- 标签 -->
      <div>
        <label class="block text-sm font-medium mb-2 transition-colors" 
               :class="isDark ? 'text-white' : 'text-gray-800'">
          标签 (用逗号分隔)
        </label>
        <input 
          type="text" 
          v-model="tagsInput"
          placeholder="Vue3, JavaScript, 前端开发"
          class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          :class="isDark 
            ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
        />
      </div>

      <!-- 编辑器工具栏 -->
      <div class="border rounded-t-lg transition-colors" 
           :class="isDark ? 'border-tokyo-night-blue' : 'border-gray-300'">
        <div class="flex flex-wrap gap-1 p-3 border-b transition-colors" 
             :class="isDark ? 'border-tokyo-night-bg-highlight bg-tokyo-night-bg-highlight' : 'border-gray-200 bg-gray-50'">
          <button 
            type="button"
            v-for="tool in editorTools" 
            :key="tool.name"
            @click="insertMarkdown(tool.markdown)"
            class="px-3 py-1 rounded text-sm font-medium transition-all hover:scale-105"
            :class="isDark 
              ? 'bg-tokyo-night-bg text-tokyo-night-fg hover:bg-tokyo-night-blue' 
              : 'bg-white text-gray-700 hover:bg-blue-100'"
            :title="tool.name"
          >
            {{ tool.icon }} {{ tool.name }}
          </button>
        </div>

        <!-- Markdown 编辑器 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <!-- 编辑区 -->
          <div class="border-r transition-colors" :class="isDark ? 'border-tokyo-night-blue' : 'border-gray-300'">
            <div class="p-3 text-sm font-medium border-b transition-colors" 
                 :class="isDark ? 'border-tokyo-night-bg-highlight bg-tokyo-night-bg-highlight text-white' : 'border-gray-200 bg-gray-50 text-gray-800'">
              Markdown 编辑器
            </div>
            <textarea 
              ref="editorTextarea"
              v-model="formData.content"
              @keydown="handleKeyDown"
              @input="handleInput"
              rows="20"
              placeholder="在这里使用 Markdown 语法编写文章内容..."
              class="w-full p-4 resize-none focus:outline-none font-mono text-sm transition-colors"
              :class="isDark 
                ? 'bg-tokyo-night-bg text-white placeholder-gray-400' 
                : 'bg-white text-gray-900 placeholder-gray-500'"
            ></textarea>
          </div>

          <!-- 预览区 -->
          <div>
            <div class="p-3 text-sm font-medium border-b transition-colors" 
                 :class="isDark ? 'border-tokyo-night-bg-highlight bg-tokyo-night-bg-highlight text-white' : 'border-gray-200 bg-gray-50 text-gray-800'">
              实时预览
            </div>
            <div class="p-4 h-96 overflow-y-auto prose prose-sm max-w-none transition-colors" 
                 :class="isDark ? 'prose-invert bg-tokyo-night-bg' : 'bg-white'">
              <MarkdownRenderer :markdown="formData.content" />
            </div>
          </div>
        </div>
      </div>

      <!-- 文件上传区域 -->
      <div>
        <label class="block text-sm font-medium mb-2 transition-colors" 
               :class="isDark ? 'text-white' : 'text-gray-800'">
          文件上传 (图片/视频，最大200MB)
        </label>
        <div 
          @drop.prevent="handleFileDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed rounded-lg p-6 text-center transition-all"
          :class="isDark 
            ? 'border-tokyo-night-blue bg-tokyo-night-bg-highlight hover:border-tokyo-night-cyan' 
            : 'border-gray-300 bg-gray-50 hover:border-blue-400'"
        >
          <svg class="w-12 h-12 mx-auto mb-3 transition-colors" 
               :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-500'" 
               fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M24 8v24m-8-8l8 8 8-8M8 40h32"/>
          </svg>
          <p class="text-sm transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            拖拽文件到这里，或者 
            <button type="button" @click="$refs.fileInput.click()" 
                    class="text-blue-500 hover:text-blue-600 underline">
              点击选择文件
            </button>
          </p>
          <input 
            ref="fileInput"
            type="file" 
            multiple 
            accept="image/*,video/*"
            @change="handleFileSelect"
            class="hidden"
          />
        </div>
        
        <!-- 已上传的文件 -->
        <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
          <div 
            v-for="(file, index) in uploadedFiles" 
            :key="index"
            class="flex items-center justify-between p-3 rounded-lg transition-colors"
            :class="isDark ? 'bg-tokyo-night-bg-highlight' : 'bg-gray-100'"
          >
            <div class="flex items-center gap-3">
              <span class="text-lg">{{ file.type.startsWith('image/') ? '🖼️' : '🎥' }}</span>
              <div>
                <p class="font-medium transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
                  {{ file.name }}
                </p>
                <p class="text-xs transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>
            <button 
              @click="removeFile(index)"
              class="text-red-500 hover:text-red-600 transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import MarkdownRenderer from './MarkdownRenderer.vue'

const { isDark } = useTheme()

const props = defineProps({
  post: Object,
  isSaving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

// 表单数据
const formData = reactive({
  title: '',
  slug: '',
  content: '',
  status: 'draft',
  tags: []
})

// 标签输入
const tagsInput = ref('')

// 上传的文件
const uploadedFiles = ref([])

// 编辑器引用
const editorTextarea = ref(null)

// 编辑器工具栏
const editorTools = ref([
  { name: '标题', icon: '#', markdown: '# ' },
  { name: '粗体', icon: 'B', markdown: '**文本**' },
  { name: '斜体', icon: 'I', markdown: '*文本*' },
  { name: '代码', icon: '<>', markdown: '`代码`' },
  { name: '链接', icon: '🔗', markdown: '[链接文本](URL)' },
  { name: '图片', icon: '🖼️', markdown: '![图片描述](图片URL)' },
  { name: '列表', icon: '•', markdown: '- ' },
  { name: '引用', icon: '"', markdown: '> ' }
])

// 初始化数据
if (props.post) {
  Object.assign(formData, props.post)
  tagsInput.value = props.post.tags?.join(', ') || ''
}

// 监听标题变化自动生成slug
watch(() => formData.title, (newTitle) => {
  if (!props.post) { // 只在新文章时自动生成
    formData.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// 处理键盘事件（自动缩进）
const handleKeyDown = (event) => {
  const textarea = event.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  
  // Tab 键：插入 2 个空格（自动缩进）
  if (event.key === 'Tab') {
    event.preventDefault()
    
    const beforeCursor = formData.content.substring(0, start)
    const afterCursor = formData.content.substring(end)
    
    // 如果按 Shift+Tab，减少缩进
    if (event.shiftKey) {
      // 查找当前行的开始位置
      const lineStart = beforeCursor.lastIndexOf('\n') + 1
      const currentLine = beforeCursor.substring(lineStart)
      
      // 如果行首有 2 个空格，删除它们
      if (currentLine.startsWith('  ')) {
        const newStart = start - 2
        formData.content = formData.content.substring(0, lineStart) + 
                          currentLine.substring(2) + 
                          afterCursor
        setTimeout(() => {
          textarea.setSelectionRange(newStart, newStart)
        }, 10)
      }
    } else {
      // 普通 Tab：插入 2 个空格
      const indent = '  '
      formData.content = beforeCursor + indent + afterCursor
      setTimeout(() => {
        textarea.setSelectionRange(start + indent.length, start + indent.length)
      }, 10)
    }
  }
  
  // Enter 键：自动继承上一行的缩进（在默认行为之后处理）
  if (event.key === 'Enter') {
    // 不阻止默认行为，让换行先发生
    setTimeout(() => {
      const newStart = textarea.selectionStart
      const beforeCursor = formData.content.substring(0, newStart - 1) // -1 因为已经插入了换行
      const lineStart = beforeCursor.lastIndexOf('\n') + 1
      const currentLine = beforeCursor.substring(lineStart)
      
      // 计算上一行的前导空格
      const indentMatch = currentLine.match(/^(\s*)/)
      if (indentMatch) {
        const indent = indentMatch[1]
        
        // 如果上一行以某些字符结尾，可能需要额外缩进
        const trimmedLine = currentLine.trim()
        const needsExtraIndent = /[{\[\(:]$/.test(trimmedLine)
        
        // 在当前位置插入缩进
        const afterCursor = formData.content.substring(newStart)
        const newIndent = indent + (needsExtraIndent ? '  ' : '')
        const indentLength = newIndent.length
        formData.content = formData.content.substring(0, newStart) + newIndent + afterCursor
        
        // 设置光标位置
        setTimeout(() => {
          textarea.setSelectionRange(newStart + indentLength, newStart + indentLength)
        }, 10)
      }
    }, 0)
  }
}

// 处理输入事件（用于其他自动格式化）
const handleInput = (event) => {
  // 可以在这里添加其他自动格式化逻辑
}

// 插入 Markdown 语法
const insertMarkdown = (markdown) => {
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = formData.content.substring(start, end)
  
  let insertText = markdown
  if (selectedText && markdown.includes('文本')) {
    insertText = markdown.replace('文本', selectedText)
  }
  
  formData.content = formData.content.substring(0, start) + 
                    insertText + 
                    formData.content.substring(end)
  
  // 重新聚焦并设置光标位置
  setTimeout(() => {
    textarea.focus()
    const newPosition = start + insertText.length
    textarea.setSelectionRange(newPosition, newPosition)
  }, 10)
}

// 处理文件选择
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

// 处理文件拖拽
const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

// 处理文件
const processFiles = (files) => {
  files.forEach(file => {
    // 检查文件大小 (200MB = 200 * 1024 * 1024 bytes)
    if (file.size > 200 * 1024 * 1024) {
      alert(`文件 ${file.name} 超过200MB限制`)
      return
    }
    
    // 检查文件类型
    if (!file.type.match(/^(image|video)\//)) {
      alert(`文件 ${file.name} 不是支持的图片或视频格式`)
      return
    }
    
    uploadedFiles.value.push(file)
    
    // 如果是图片，插入到编辑器中
    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      const imageMarkdown = `![${file.name}](${imageUrl})\n\n`
      formData.content += imageMarkdown
    }
  })
}

// 移除文件
const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 保存草稿
const saveDraft = () => {
  savePost('draft')
}

// 发布文章
const publish = () => {
  savePost('published')
}

// 初始化编辑器
onMounted(() => {
  // 可以在这里添加编辑器初始化逻辑
})

// 保存文章
const savePost = (status) => {
  if (!formData.title.trim()) {
    alert('请输入文章标题')
    return
  }
  
  if (!formData.slug.trim()) {
    alert('请输入文章别名')
    return
  }
  
  if (!formData.content.trim()) {
    alert('请输入文章内容')
    return
  }
  
  // 处理标签
  formData.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
  
  const postData = {
    ...formData,
    status,
    updatedAt: new Date().toISOString()
  }
  
  emit('save', postData)
}
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Prose 样式覆盖 */
.prose h1, .prose h2, .prose h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 0.75rem;
}

.prose code {
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose img {
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* 代码块样式 */
.prose pre {
  @apply rounded-lg p-4 overflow-x-auto my-4;
  background-color: #0d1117 !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.prose pre code {
  @apply p-0 bg-transparent;
  font-size: 0.875rem;
  line-height: 1.6;
  color: inherit;
}

.prose code.hljs {
  @apply bg-transparent;
}

/* 行内代码样式 */
.prose :not(pre) > code {
  @apply px-1.5 py-0.5 rounded;
  background-color: rgba(110, 118, 129, 0.4);
  font-size: 0.875em;
}

/* 暗色模式下的代码块 */
.dark .prose pre {
  background-color: #0d1117 !important;
  border-color: rgba(255, 255, 255, 0.1);
}

/* 亮色模式下的代码块 */
.light .prose pre {
  background-color: #f6f8fa !important;
  border-color: rgba(0, 0, 0, 0.1);
}

.light .prose :not(pre) > code {
  background-color: rgba(175, 184, 193, 0.2);
}
</style>
