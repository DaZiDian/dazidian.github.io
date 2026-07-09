<template>
  <div class="pt-20 pb-12 min-h-screen" :class="isDark ? 'dark' : 'light'">
    <div class="container mx-auto px-4 max-w-4xl">
      
      <!-- 返回按钮 -->
      <button 
        @click="router.push('/blog')"
        class="mb-8 flex items-center gap-2 text-sm font-medium transition-colors hover:text-tokyo-night-cyan"
        :class="isDark ? 'text-gray-400' : 'text-gray-600'"
      >
        <span>← 返回文章列表</span>
      </button>

      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin text-4xl mb-4" :class="isDark ? 'text-tokyo-night-blue' : 'text-blue-500'">↻</div>
        <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">加载文章中...</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <div class="text-6xl mb-4">🥲</div>
        <h2 class="text-2xl font-bold mb-2 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">文章未找到</h2>
        <p class="transition-colors mb-6" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ error }}</p>
        <button 
          @click="router.push('/blog')"
          class="px-6 py-2 rounded-lg font-medium transition-all"
          :class="isDark ? 'bg-tokyo-night-blue text-white hover:bg-tokyo-night-cyan' : 'bg-blue-600 text-white hover:bg-blue-700'"
        >
          返回列表
        </button>
      </div>

      <article v-else-if="article" class="glass-effect rounded-3xl p-8 md:p-12 animate-fade-in">
        <!-- 文章头部 -->
        <header class="mb-10 text-center border-b pb-8" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
          <h1 class="text-3xl md:text-5xl font-bold mb-6 leading-tight transition-colors" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ article.title }}
          </h1>
          
          <div class="flex flex-wrap justify-center items-center gap-4 text-sm transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            <div class="flex items-center gap-1">
              <span>📅</span>
              <span>{{ formatDate(article.created_at || article.updated_at) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="px-2 py-1 rounded text-xs" :class="isDark ? 'bg-tokyo-night-bg-highlight text-tokyo-night-magenta' : 'bg-purple-100 text-purple-700'">
                {{ article.slug }}
              </span>
            </div>
          </div>
        </header>

        <!-- 文章正文 -->
        <div class="blog-content transition-colors">
          <MarkdownRenderer 
            :markdown="article.content"
            class="prose prose-lg max-w-none w-full"
            :class="isDark ? 'prose-invert custom-prose-dark' : 'custom-prose-light'"
            :editable="false"
            :show-language-selector="false"
          />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import axios from 'axios'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const { isDark } = useTheme()
const route = useRoute()
const router = useRouter()

const API_BASE = '/api'
const isLoading = ref(true)
const error = ref('')
const article = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0]
  return new Date(dateString).toISOString().split('T')[0]
}

const fetchArticle = async () => {
  const slug = route.params.slug
  if (!slug) {
    error.value = '无效的文章链接'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = ''
    const response = await axios.get(`${API_BASE}/blog?slug=${slug}`)
    
    if (response.data.success && response.data.data) {
      article.value = response.data.data
      // 动态修改页面标题
      document.title = `${article.value.title} - DaZiDian`
    } else {
      error.value = '未能加载文章内容'
    }
  } catch (err) {
    console.error('获取文章失败:', err)
    error.value = err.response?.data?.error || '服务器开小差了，请稍后再试'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<style>
/* 自定义文章内链接和基础样式，覆盖 prose 默认行为，保证链接好看 */
.custom-prose-light a {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}
.custom-prose-light a:hover {
  border-bottom-color: #2563eb;
}

.custom-prose-dark a {
  color: var(--tokyo-night-cyan, #7dcfff);
  text-decoration: none;
  border-bottom: 1px dashed rgba(125, 207, 255, 0.4);
  transition: all 0.3s ease;
}
.custom-prose-dark a:hover {
  color: var(--tokyo-night-blue, #7aa2f7);
  border-bottom-color: var(--tokyo-night-blue, #7aa2f7);
  border-bottom-style: solid;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
