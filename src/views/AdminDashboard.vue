<template>
  <div class="pt-20 pb-12" :class="isDark ? 'dark' : 'light'">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="flex gap-6">
        <aside class="w-64 flex-shrink-0 hidden lg:block">
          <div class="glass-effect rounded-2xl p-4 sticky top-24">
            <h2 class="text-xl font-bold mb-4 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
              管理菜单
            </h2>
            <nav class="space-y-2">
              <button
                v-for="item in menuItems"
                :key="item.key"
                @click="activeTab = item.key"
                class="w-full text-left px-4 py-3 rounded-lg transition-all duration-300"
                :class="activeTab === item.key
                  ? (isDark ? 'bg-tokyo-night-blue text-white' : 'bg-blue-600 text-white')
                  : (isDark ? 'text-gray-300 hover:bg-tokyo-night-bg-highlight' : 'text-gray-700 hover:bg-gray-100')"
              >
                {{ item.label }}
              </button>
            </nav>
            <div class="mt-6 pt-6 border-t" :class="isDark ? 'border-tokyo-night-bg-highlight' : 'border-gray-200'">
              <button
                @click="logout"
                class="w-full px-4 py-2 rounded-lg font-medium border transition-all duration-300"
                :class="isDark
                  ? 'border-tokyo-night-blue text-tokyo-night-cyan hover:bg-tokyo-night-blue hover:text-white'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'"
              >
                退出登录
              </button>
            </div>
          </div>
        </aside>

        <section class="flex-1 min-w-0">
          <div class="glass-effect rounded-2xl p-3 mb-5 lg:hidden">
            <div class="flex gap-2 overflow-x-auto">
              <button
                v-for="item in menuItems"
                :key="item.key"
                @click="activeTab = item.key"
                class="px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all"
                :class="activeTab === item.key
                  ? (isDark ? 'bg-tokyo-night-blue text-white' : 'bg-blue-600 text-white')
                  : (isDark ? 'bg-tokyo-night-bg-highlight text-gray-200' : 'bg-gray-100 text-gray-700')"
              >
                {{ item.label }}
              </button>
              <button
                @click="logout"
                class="px-3 py-2 rounded-lg text-sm whitespace-nowrap bg-red-600 text-white"
              >
                退出
              </button>
            </div>
          </div>

          <div v-if="notice.message" class="mb-4 rounded-xl p-3 text-sm" :class="notice.success ? successClass : errorClass">
            {{ notice.message }}
          </div>

          <div v-if="activeTab === 'blog'">
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-3xl font-bold title-reveal">文章管理</h1>
              <button
                @click="showEditor = true; editingPost = null"
                class="px-6 py-2 rounded-lg font-medium transition-all duration-300"
                :class="isDark
                  ? 'bg-tokyo-night-blue hover:bg-tokyo-night-blue0 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'"
              >
                写新文章
              </button>
            </div>

            <div v-if="!showEditor" class="space-y-4">
              <div v-if="isLoading && blogPosts.length === 0" class="text-center py-12">
                <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">加载中...</p>
              </div>
              <div v-else-if="blogPosts.length === 0" class="text-center py-12">
                <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  还没有文章，点击“写新文章”开始创作吧
                </p>
              </div>
              <div
                v-else
                v-for="post in blogPosts"
                :key="post.id"
                class="glass-effect rounded-2xl p-6 flex justify-between items-center gap-4"
              >
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-semibold mb-2 truncate transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
                    {{ post.title }}
                  </h3>
                  <div class="flex gap-3 text-sm flex-wrap transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                    <span>{{ post.date }}</span>
                    <span>{{ post.status === 'published' ? '已发布' : '草稿' }}</span>
                    <span class="break-all">slug: {{ post.slug }}</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="editPost(post)"
                    :disabled="isLoading"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    :class="isDark
                      ? 'bg-tokyo-night-bg-highlight text-tokyo-night-cyan hover:bg-tokyo-night-blue'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
                  >
                    编辑
                  </button>
                  <button
                    @click="deletePost(post)"
                    :disabled="isLoading"
                    class="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>

            <BlogEditor
              v-if="showEditor"
              :post="editingPost"
              :is-saving="isSaving"
              @save="savePost"
              @cancel="showEditor = false; editingPost = null"
            />
          </div>

          <div v-if="activeTab === 'guestbook'">
            <GuestbookAdmin />
          </div>

          <div v-if="activeTab === 'friends'">
            <FriendLinksAdmin />
          </div>

          <div v-if="activeTab === 'mail'">
            <MailSettingsAdmin />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useTheme } from '../composables/useTheme';
import BlogEditor from '../components/BlogEditor.vue';
import GuestbookAdmin from '../components/GuestbookAdmin.vue';
import FriendLinksAdmin from '../components/FriendLinksAdmin.vue';
import MailSettingsAdmin from '../components/MailSettingsAdmin.vue';

const { isDark } = useTheme();
const router = useRouter();
const API_BASE = '/api';

const isLoading = ref(false);
const isSaving = ref(false);
const showEditor = ref(false);
const editingPost = ref(null);
const activeTab = ref('blog');
const blogPosts = ref([]);

const notice = ref({
  success: false,
  message: '',
});

const menuItems = [
  { key: 'blog', label: '📝 文章管理' },
  { key: 'guestbook', label: '💬 留言管理' },
  { key: 'friends', label: '🔗 友链管理' },
  { key: 'mail', label: '📮 邮件协议' },
];

const successClass = computed(() =>
  isDark.value ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
);

const errorClass = computed(() =>
  isDark.value ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-red-50 text-red-700 border border-red-200'
);

const setNotice = (success, message) => {
  notice.value = { success, message };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('blog_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleUnauthorized = () => {
  localStorage.removeItem('blog_admin_token');
  router.replace({
    path: '/admin/login',
    query: { redirect: '/admin' },
  });
};

const logout = () => {
  localStorage.removeItem('blog_admin_token');
  router.replace('/admin/login');
};

const fetchPosts = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE}/blog`, {
      headers: getAuthHeaders(),
    });
    if (response.data?.success) {
      blogPosts.value = (response.data.data || []).map((post) => ({
        ...post,
        date: post.created_at
          ? new Date(post.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        tags: Array.isArray(post.tags) ? post.tags : [],
      }));
    }
  } catch (error) {
    console.error('加载文章失败:', error);
    if (error.response?.status === 401) {
      handleUnauthorized();
    } else {
      setNotice(false, error.response?.data?.error || '加载文章失败，请稍后重试。');
    }
  } finally {
    isLoading.value = false;
  }
};

const editPost = async (post) => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE}/blog?slug=${post.slug}`, {
      headers: getAuthHeaders(),
    });
    if (response.data?.success) {
      editingPost.value = {
        ...response.data.data,
        tags: Array.isArray(response.data.data.tags) ? response.data.data.tags : [],
      };
      showEditor.value = true;
    }
  } catch (error) {
    console.error('加载文章详情失败:', error);
    if (error.response?.status === 401) {
      handleUnauthorized();
    } else {
      setNotice(false, error.response?.data?.error || '加载文章详情失败。');
    }
  } finally {
    isLoading.value = false;
  }
};

const savePost = async (postData) => {
  try {
    isSaving.value = true;
    if (editingPost.value?.id) {
      const response = await axios.put(`${API_BASE}/blog`, {
        id: editingPost.value.id,
        slug: postData.slug,
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        status: postData.status,
      }, {
        headers: getAuthHeaders(),
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || '更新失败');
      }
      setNotice(true, '文章更新成功。');
    } else {
      const response = await axios.post(`${API_BASE}/blog`, {
        slug: postData.slug,
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        status: postData.status,
      }, {
        headers: getAuthHeaders(),
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || '创建失败');
      }
      setNotice(true, '文章创建成功。');
    }

    showEditor.value = false;
    editingPost.value = null;
    await fetchPosts();
    window.dispatchEvent(new CustomEvent('blog-updated'));
  } catch (error) {
    console.error('保存文章失败:', error);
    if (error.response?.status === 401) {
      handleUnauthorized();
    } else {
      setNotice(false, error.response?.data?.error || error.message || '保存文章失败。');
    }
  } finally {
    isSaving.value = false;
  }
};

const deletePost = async (post) => {
  if (!confirm(`确定删除文章「${post.title}」吗？此操作不可撤销。`)) {
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.delete(`${API_BASE}/blog?id=${post.id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.data?.success) {
      throw new Error(response.data?.error || '删除失败');
    }

    setNotice(true, '文章已删除。');
    await fetchPosts();
    window.dispatchEvent(new CustomEvent('blog-updated'));
  } catch (error) {
    console.error('删除文章失败:', error);
    if (error.response?.status === 401) {
      handleUnauthorized();
    } else {
      setNotice(false, error.response?.data?.error || error.message || '删除文章失败。');
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const token = localStorage.getItem('blog_admin_token');
  if (!token) {
    handleUnauthorized();
    return;
  }
  fetchPosts();
});
</script>
