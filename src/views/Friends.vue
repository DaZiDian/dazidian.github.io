<template>
  <div class="pt-20 pb-12" :class="isDark ? 'dark' : 'light'">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="text-center mb-10 animate-fade-in">
        <h1 class="text-5xl font-bold mb-4 title-reveal">
          友情链接 | FRIEND LINKS
        </h1>
        <p class="transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          欢迎互换友链，提交后会进入审核队列
        </p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section class="xl:col-span-2">
          <div class="glass-effect rounded-3xl p-8">
            <div class="flex items-center justify-between gap-4 mb-6">
              <h2 class="text-2xl font-bold transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-700'">
                已通过友链
              </h2>
              <button
                @click="fetchApprovedFriends"
                :disabled="isLoadingApproved"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                :class="isDark
                  ? 'bg-tokyo-night-bg-highlight text-tokyo-night-cyan hover:bg-tokyo-night-blue'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
              >
                {{ isLoadingApproved ? '加载中...' : '刷新' }}
              </button>
            </div>

            <div v-if="isLoadingApproved && !friends.length" class="py-10 text-center">
              <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">正在加载友链...</p>
            </div>

            <div v-else-if="!friends.length" class="py-10 text-center rounded-2xl friend-empty-card">
              <p class="text-lg font-medium mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                暂无友链
              </p>
              <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                提交你的站点申请，成为第一位伙伴
              </p>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <a
                v-for="friend in friends"
                :key="friend.id"
                :href="friend.site_url"
                target="_blank"
                rel="noopener noreferrer"
                class="friend-logo-card rounded-2xl p-5 block transition-all duration-300"
              >
                <div class="friend-logo-box mb-4">
                  <img
                    v-if="friend.logo_url"
                    :src="friend.logo_url"
                    :alt="friend.site_name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ (friend.site_name || '?').charAt(0) }}</span>
                </div>
                <h3 class="friend-site-name transition-colors" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ friend.site_name }}
                </h3>
              </a>
            </div>
          </div>
        </section>

        <section>
          <div class="glass-effect rounded-3xl p-8">
            <h2 class="text-2xl font-bold mb-6 transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-700'">
              申请友链
            </h2>

            <form @submit.prevent="submitApplication" class="space-y-4">
              <div>
                <label class="block text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  昵称
                </label>
                <input
                  v-model="form.nickname"
                  type="text"
                  placeholder="你的昵称"
                  class="friend-input"
                />
              </div>

              <div>
                <label class="block text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  站点名称 *
                </label>
                <input
                  v-model="form.site_name"
                  type="text"
                  required
                  placeholder="例如：DaZiDian Blog"
                  class="friend-input"
                />
              </div>

              <div>
                <label class="block text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  站点链接 *
                </label>
                <input
                  v-model="form.site_url"
                  type="url"
                  required
                  placeholder="https://example.com"
                  class="friend-input"
                />
              </div>

              <div>
                <label class="block text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  站点描述
                </label>
                <textarea
                  v-model="form.site_description"
                  rows="3"
                  placeholder="简短介绍你的站点内容"
                  class="friend-input resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  用户申请留言
                </label>
                <textarea
                  v-model="form.application_message"
                  rows="3"
                  placeholder="可填写希望管理员了解的补充内容"
                  class="friend-input resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  联系邮箱
                </label>
                <input
                  v-model="form.contact_email"
                  type="email"
                  placeholder="you@example.com"
                  class="friend-input"
                />
              </div>

              <div>
                <label class="block text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                  站点 Logo（可选）
                </label>
                <input
                  v-model="form.logo_url"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  class="friend-input"
                />
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-3 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-60 friend-submit-btn"
              >
                {{ isSubmitting ? '提交中...' : '提交申请' }}
              </button>
            </form>

            <p v-if="feedback.message" class="mt-4 text-sm" :class="feedback.success ? 'text-emerald-500' : 'text-red-500'">
              {{ feedback.message }}
            </p>
          </div>
        </section>
      </div>

      <section class="mt-8">
        <div class="glass-effect rounded-3xl p-8">
          <div class="flex items-center justify-between gap-4 mb-6">
            <h2 class="text-2xl font-bold transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-700'">
              申请记录
            </h2>
            <button
              @click="fetchApplicationRecords"
              :disabled="isLoadingRecords"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              :class="isDark
                ? 'bg-tokyo-night-bg-highlight text-tokyo-night-cyan hover:bg-tokyo-night-blue'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
            >
              {{ isLoadingRecords ? '加载中...' : '刷新' }}
            </button>
          </div>

          <div v-if="isLoadingRecords && !applicationRecords.length" class="py-10 text-center">
            <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">正在加载申请记录...</p>
          </div>

          <div v-else-if="!applicationRecords.length" class="py-10 text-center rounded-2xl friend-empty-card">
            <p class="text-lg font-medium mb-2 transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
              暂无申请记录
            </p>
            <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              提交后将在这里看到审核进度
            </p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="record in applicationRecords"
              :key="record.id"
              class="record-card rounded-2xl p-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div class="min-w-[220px]">
                  <p class="font-semibold transition-colors" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ record.site_name }}
                  </p>
                  <p class="text-xs transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                    申请时间：{{ formatDate(record.created_at) }}
                  </p>
                </div>
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="statusClass(record.status)"
                >
                  {{ statusLabel(record.status) }}
                </span>
              </div>
              <p class="text-sm transition-colors" :class="isDark ? 'text-gray-200' : 'text-gray-700'">
                {{ displayReason(record) }}
              </p>
              <p
                v-if="record.application_message"
                class="text-sm mt-2 transition-colors"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                申请留言：{{ record.application_message }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useTheme } from '../composables/useTheme';

const { isDark } = useTheme();
const API_BASE = '/api';

const isLoadingApproved = ref(false);
const isLoadingRecords = ref(false);
const isSubmitting = ref(false);
const friends = ref([]);
const applicationRecords = ref([]);
const feedback = ref({
  success: false,
  message: '',
});

const form = reactive({
  nickname: '',
  site_name: '',
  site_url: '',
  site_description: '',
  application_message: '',
  contact_email: '',
  logo_url: '',
});

const defaultReasons = {
  approved: '已通过并添加',
  pending: '请检查您的站点',
  rejected: '不予通过',
};

const statusLabel = (status) => {
  if (status === 'approved') return '已通过';
  if (status === 'rejected') return '不通过';
  return '待处理';
};

const statusClass = (status) => {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-700';
  if (status === 'rejected') return 'bg-red-100 text-red-700';
  return 'bg-amber-100 text-amber-700';
};

const displayReason = (record) => {
  const adminNote = String(record.admin_note || '').trim();
  if (adminNote) return adminNote;
  return defaultReasons[record.status] || defaultReasons.pending;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

const resetForm = () => {
  form.site_name = '';
  form.site_url = '';
  form.site_description = '';
  form.application_message = '';
  form.logo_url = '';
};

const fetchApprovedFriends = async () => {
  try {
    isLoadingApproved.value = true;
    const response = await axios.get(`${API_BASE}/friends`);
    if (response.data?.success && Array.isArray(response.data.data)) {
      friends.value = response.data.data;
    }
  } catch (error) {
    console.error('加载友链失败:', error);
  } finally {
    isLoadingApproved.value = false;
  }
};

const fetchApplicationRecords = async () => {
  try {
    isLoadingRecords.value = true;
    const response = await axios.get(`${API_BASE}/friends?view=applications`);
    if (response.data?.success && Array.isArray(response.data.data)) {
      applicationRecords.value = response.data.data;
    }
  } catch (error) {
    console.error('加载申请记录失败:', error);
  } finally {
    isLoadingRecords.value = false;
  }
};

const fetchPageData = async () => {
  await Promise.all([
    fetchApprovedFriends(),
    fetchApplicationRecords(),
  ]);
};

const submitApplication = async () => {
  feedback.value = { success: false, message: '' };
  if (!form.site_name.trim() || !form.site_url.trim()) {
    feedback.value = { success: false, message: '请至少填写站点名称和站点链接。' };
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await axios.post(`${API_BASE}/friends`, {
      nickname: form.nickname,
      site_name: form.site_name,
      site_url: form.site_url,
      site_description: form.site_description,
      application_message: form.application_message,
      contact_email: form.contact_email,
      logo_url: form.logo_url,
    });

    if (response.data?.success) {
      feedback.value = { success: true, message: response.data.message || '申请已提交，等待审核。' };
      resetForm();
      window.dispatchEvent(new CustomEvent('friends-updated'));
    } else {
      feedback.value = { success: false, message: response.data?.error || '提交失败，请稍后重试。' };
    }
  } catch (error) {
    console.error('提交友链申请失败:', error);
    feedback.value = {
      success: false,
      message: error.response?.data?.error || '提交失败，请稍后重试。',
    };
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchPageData();
  window.addEventListener('friends-updated', fetchPageData);
});

onUnmounted(() => {
  window.removeEventListener('friends-updated', fetchPageData);
});
</script>

<style scoped>
.friend-logo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
      145deg,
      rgba(122, 162, 247, 0.2),
      rgba(125, 207, 255, 0.12) 48%,
      rgba(187, 154, 247, 0.2)
    )
    padding-box;
  border: 1px solid rgba(122, 162, 247, 0.4);
  box-shadow:
    0 0 0 1px rgba(122, 162, 247, 0.18) inset,
    0 10px 24px rgba(15, 23, 42, 0.36),
    0 0 24px rgba(125, 207, 255, 0.24);
}

.friend-logo-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 0 0 1px rgba(125, 207, 255, 0.28) inset,
    0 16px 30px rgba(15, 23, 42, 0.45),
    0 0 30px rgba(125, 207, 255, 0.32);
}

.friend-logo-box {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #7aa2f7, #7dcfff);
  font-weight: 700;
  box-shadow: 0 0 20px rgba(125, 207, 255, 0.45);
}

.friend-site-name {
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
  word-break: break-word;
}

.record-card {
  border: 1px solid rgba(122, 162, 247, 0.25);
  background: rgba(122, 162, 247, 0.08);
}

.friend-empty-card {
  border: 1px dashed rgba(125, 207, 255, 0.4);
  background: rgba(122, 162, 247, 0.08);
}

.friend-input {
  width: 100%;
  border-radius: 0.75rem;
  padding: 0.65rem 0.9rem;
  outline: none;
  border: 1px solid rgba(122, 162, 247, 0.25);
  transition: all 0.25s ease;
}

.dark .friend-input {
  background: rgba(41, 46, 66, 0.75);
  color: #fff;
}

.dark .friend-input::placeholder {
  color: rgba(192, 202, 245, 0.55);
}

.light .friend-input {
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
}

.light .friend-input::placeholder {
  color: rgba(100, 116, 139, 0.75);
}

.friend-input:focus {
  border-color: rgba(125, 207, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(125, 207, 255, 0.2);
}

.friend-submit-btn {
  background: linear-gradient(135deg, #7aa2f7, #7dcfff);
  box-shadow: 0 10px 20px rgba(122, 162, 247, 0.28);
}

.friend-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(122, 162, 247, 0.36);
}
</style>
