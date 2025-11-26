<template>
  <div class="pt-20 pb-12" :class="isDark ? 'dark' : 'light'">
    <div class="container mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-5xl font-bold mb-4 title-reveal">
          文章 | BLOG
        </h1>
        <p class="transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">分享我的想法和经验</p>
      </div>

      <!-- 文章列表 -->
      <div class="max-w-4xl mx-auto space-y-6">
        <div v-if="isLoading" class="text-center py-12">
          <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">加载中...</p>
        </div>
        <article 
          v-else
          v-for="(article, index) in articles" 
          :key="article.id || article.slug || index"
          class="rounded-2xl p-6 card-hover"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <!-- 标题 -->
              <h2 class="blog-article-title text-2xl transition-colors cursor-pointer hover:opacity-80 mb-2">
                {{ article.title }}
              </h2>
              
              <!-- 发布时间和状态信息 -->
              <div class="blog-article-meta flex items-center gap-3 flex-wrap">
                <span>{{ article.date }}</span>
                <span class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="isDark 
                    ? 'bg-tokyo-night-green/20 text-tokyo-night-green' 
                    : 'bg-green-100 text-green-700'"
                >
                  已发布
                </span>
                <span class="text-xs opacity-60 hidden sm:inline">slug: {{ article.slug }}</span>
              </div>
              
              <!-- 正文预览 -->
              <div v-if="!expandedArticles[article.id]" class="prose prose-sm max-w-none leading-relaxed mb-3">
                <p v-if="article.content" class="blog-article-content line-clamp-2">{{ article.content }}</p>
                <p v-else class="blog-article-meta text-xs italic opacity-60">暂无内容预览...</p>
              </div>
              
              <!-- 展开的文章详情 -->
              <div v-if="expandedArticles[article.id]" class="mt-4 pt-4 border-t transition-colors"
                   :class="isDark ? 'border-tokyo-night-bg-highlight' : 'border-gray-200'">
                <MarkdownRenderer 
                  :markdown="article.fullContent || article.content"
                  class="prose prose-lg max-w-none transition-colors mb-4"
                  :class="isDark ? 'prose-invert' : ''"
                  :editable="false"
                  :show-language-selector="false"
                />
              </div>
            </div>
            
            <!-- 阅读/收起按钮 -->
            <div class="flex-shrink-0">
              <button
                v-if="!expandedArticles[article.id]"
                @click="expandArticle(article)"
                class="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                :class="isDark 
                  ? 'bg-tokyo-night-blue text-white hover:bg-tokyo-night-cyan' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'"
              >
                阅读 →
              </button>
              <button
                v-else
                @click="collapseArticle(article.id)"
                class="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                :class="isDark 
                  ? 'bg-tokyo-night-bg-highlight text-tokyo-night-cyan border border-tokyo-night-blue hover:bg-tokyo-night-blue hover:text-white' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'"
              >
                收起 ↑
              </button>
            </div>
          </div>
        </article>

        <!-- 空状态 -->
        <div v-if="!isLoading && articles.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">📝</div>
          <p class="text-xl transition-colors" :class="isDark ? 'text-tokyo-night-fg' : 'text-gray-800'">暂无文章</p>
          <p class="transition-colors mt-2" :class="isDark ? 'text-tokyo-night-fg-dark' : 'text-gray-600'">敬请期待...</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="articles.length > 0" class="mt-12 flex justify-center gap-2">
        <button 
          v-for="page in totalPages" 
          :key="page"
          :class="{ 'bg-tokyo-night-blue text-white': currentPage === page, 'glass-effect text-tokyo-night-fg': currentPage !== page }"
          class="w-10 h-10 rounded-full hover:scale-110 transition-all duration-300 font-medium border border-tokyo-night-blue/30"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import { useTheme } from '../composables/useTheme'
import axios from 'axios'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

useScrollAnimation()
const { isDark } = useTheme()

const API_BASE = '/api'
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

// 文章数据
const articles = ref([])
// 展开的文章ID集合
const expandedArticles = ref({})

// 展开文章详情
const expandArticle = async (article) => {
  // 如果还没有加载完整内容，先加载
  if (!article.fullContent) {
    try {
      const response = await axios.get(`${API_BASE}/blog?slug=${article.slug}`)
      if (response.data.success) {
        const fullArticle = response.data.data
        // 更新文章数据
        const index = articles.value.findIndex(a => a.id === article.id)
        if (index !== -1) {
          articles.value[index].fullContent = fullArticle.content
        }
        expandedArticles.value[article.id] = true
      }
    } catch (error) {
      console.error('加载文章详情失败:', error)
      alert('加载文章详情失败')
    }
  } else {
    expandedArticles.value[article.id] = true
  }
}

// 收起文章详情
const collapseArticle = (articleId) => {
  expandedArticles.value[articleId] = false
}


// 从API加载文章
const fetchArticles = async () => {
  try {
    isLoading.value = true
    const response = await axios.get(`${API_BASE}/blog`)
    console.log('博客API响应:', response.data) // 调试信息
    if (response.data.success && Array.isArray(response.data.data)) {
      // 显示所有文章的状态信息用于调试
      response.data.data.forEach(post => {
        console.log(`文章: ${post.title}, 状态: "${post.status}", ID: ${post.id}`)
      })
      
      // 显示所有文章，包括草稿（管理员可以看到）
      const allArticles = response.data.data
        .filter(post => post.status === 'published') // 只显示已发布的文章
        .map(post => {
          // 解析tags（可能是JSONB格式）
          let parsedTags = [];
          try {
            if (typeof post.tags === 'string') {
              parsedTags = JSON.parse(post.tags);
            } else if (Array.isArray(post.tags)) {
              parsedTags = post.tags;
            }
          } catch (e) {
            console.warn('解析tags失败:', e);
            parsedTags = [];
          }
          
          return {
            ...post,
            tags: parsedTags,
            slug: post.slug,
            title: post.title,
            date: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            location: '中国 山东 青岛',
            content: post.content ? (post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content) : ''
          };
        })
        .sort((a, b) => {
          // 按更新时间倒序排序
          const dateA = new Date(a.updated_at || a.created_at || 0)
          const dateB = new Date(b.updated_at || b.created_at || 0)
          return dateB - dateA
        })
      
      articles.value = allArticles
      console.log(`最终显示的文章数量: ${articles.value.length}`, articles.value)
      
      // 计算分页
      totalPages.value = Math.ceil(articles.value.length / 10) || 1
    } else {
      console.warn('API返回数据格式错误或为空')
      articles.value = []
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    console.error('错误详情:', error.response?.data || error.message)
    // 保持现有文章，不要清空（如果是网络错误）
    if (!error.response || error.response.status >= 500) {
      console.log('网络错误或服务器错误，保持现有数据')
    } else {
      articles.value = []
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchArticles()
  
  // 监听博客更新事件，自动刷新文章列表
  window.addEventListener('blog-updated', fetchArticles)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('blog-updated', fetchArticles)
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}
</style>

