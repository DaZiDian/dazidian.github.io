<template>
  <div class="space-y-4">
    <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
      <h2 class="text-2xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
        友情链接管理
      </h2>
      <div class="flex gap-2">
        <select
          v-model="statusFilter"
          @change="fetchFriends"
          class="px-3 py-2 rounded-lg border text-sm"
          :class="isDark
            ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white'
            : 'bg-white border-gray-300 text-gray-900'"
        >
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
        <button
          @click="fetchFriends"
          :disabled="isLoading"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          :class="isDark
            ? 'bg-tokyo-night-bg-highlight text-tokyo-night-cyan hover:bg-tokyo-night-blue'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
        >
          {{ isLoading ? '刷新中...' : '刷新' }}
        </button>
      </div>
    </div>

    <div v-if="feedback.message" class="rounded-xl p-3 text-sm" :class="feedback.success ? successClass : errorClass">
      {{ feedback.message }}
    </div>

    <div v-if="isLoading && !friends.length" class="text-center py-12">
      <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">加载中...</p>
    </div>
    <div v-else-if="!friends.length" class="text-center py-12">
      <p class="transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">暂无友链记录</p>
    </div>

    <div
      v-for="friend in friends"
      v-else
      :key="friend.id"
      class="glass-effect rounded-2xl p-6"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex-1 min-w-[220px]">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-semibold transition-colors" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ friend.site_name }}
            </h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(friend.status)">
              {{ statusLabel(friend.status) }}
            </span>
          </div>
          <p class="text-sm mb-2 break-all">
            <a :href="friend.site_url" target="_blank" rel="noopener noreferrer" class="underline">
              {{ friend.site_url }}
            </a>
          </p>
          <p class="text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            {{ friend.site_description || '暂无描述' }}
          </p>
          <p v-if="friend.application_message" class="text-sm mb-2 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            申请留言：{{ friend.application_message }}
          </p>
          <div class="text-xs flex flex-wrap gap-3 transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            <span>👤 {{ friend.nickname || '匿名站长' }}</span>
            <span v-if="friend.contact_email">📧 {{ friend.contact_email }}</span>
            <span>🕐 {{ formatDate(friend.created_at) }}</span>
          </div>
          <p v-if="friend.admin_note" class="text-xs mt-2 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            备注：{{ friend.admin_note }}
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            @click="quickUpdateStatus(friend, 'approved')"
            :disabled="isLoading"
            class="px-3 py-2 rounded-lg text-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            通过
          </button>
          <button
            @click="quickUpdateStatus(friend, 'rejected')"
            :disabled="isLoading"
            class="px-3 py-2 rounded-lg text-sm text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
          >
            拒绝
          </button>
          <button
            @click="openEditor(friend)"
            :disabled="isLoading"
            class="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            :class="isDark
              ? 'bg-tokyo-night-bg-highlight text-tokyo-night-cyan hover:bg-tokyo-night-blue'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
          >
            编辑
          </button>
          <button
            @click="deleteFriend(friend)"
            :disabled="isLoading"
            class="px-3 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <div v-if="editingItem" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeEditor">
      <div class="glass-effect rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-6 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
          编辑友链
        </h3>
        <form @submit.prevent="saveFriend" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-1">
            <label class="block text-sm mb-2">昵称</label>
            <input v-model="editForm.nickname" type="text" class="admin-input" />
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm mb-2">状态</label>
            <select v-model="editForm.status" class="admin-input">
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm mb-2">站点名称 *</label>
            <input v-model="editForm.site_name" type="text" required class="admin-input" />
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm mb-2">展示排序</label>
            <input v-model.number="editForm.display_order" type="number" class="admin-input" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm mb-2">站点链接 *</label>
            <input v-model="editForm.site_url" type="url" required class="admin-input" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm mb-2">Logo 链接</label>
            <input v-model="editForm.logo_url" type="url" class="admin-input" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm mb-2">站点描述</label>
            <textarea v-model="editForm.site_description" rows="3" class="admin-input resize-none"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm mb-2">用户申请留言</label>
            <textarea v-model="editForm.application_message" rows="3" class="admin-input resize-none"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm mb-2">联系邮箱</label>
            <input v-model="editForm.contact_email" type="email" class="admin-input" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm mb-2">管理员备注</label>
            <textarea v-model="editForm.admin_note" rows="2" class="admin-input resize-none"></textarea>
          </div>
          <div class="md:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="closeEditor"
              class="px-4 py-2 rounded-lg border"
              :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 rounded-lg text-white"
              :class="isDark ? 'bg-tokyo-night-blue hover:bg-tokyo-night-blue0' : 'bg-blue-600 hover:bg-blue-700'"
            >
              {{ isSaving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useTheme } from '../composables/useTheme';

const { isDark } = useTheme();
const API_BASE = '/api';

const isLoading = ref(false);
const isSaving = ref(false);
const friends = ref([]);
const statusFilter = ref('');
const editingItem = ref(null);
const feedback = ref({
  success: false,
  message: '',
});

const editForm = reactive({
  id: null,
  nickname: '',
  site_name: '',
  site_url: '',
  site_description: '',
  application_message: '',
  contact_email: '',
  logo_url: '',
  status: 'pending',
  admin_note: '',
  display_order: 0,
});

const successClass = computed(() =>
  isDark.value ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
);

const errorClass = computed(() =>
  isDark.value ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-red-50 text-red-700 border border-red-200'
);

const getAuthHeaders = () => {
  const token = localStorage.getItem('blog_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

const statusLabel = (status) => {
  if (status === 'approved') return '已通过';
  if (status === 'rejected') return '已拒绝';
  return '待审核';
};

const statusClass = (status) => {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-700';
  if (status === 'rejected') return 'bg-rose-100 text-rose-700';
  return 'bg-amber-100 text-amber-700';
};

const setFeedback = (success, message) => {
  feedback.value = { success, message };
};

const fetchFriends = async () => {
  try {
    isLoading.value = true;
    setFeedback(false, '');
    const suffix = statusFilter.value ? `&status=${statusFilter.value}` : '';
    const response = await axios.get(`${API_BASE}/friends?admin=1${suffix}`, {
      headers: getAuthHeaders(),
    });
    if (response.data?.success) {
      friends.value = response.data.data || [];
    }
  } catch (error) {
    console.error('加载友链失败:', error);
    setFeedback(false, error.response?.data?.error || '加载友链失败，请稍后重试。');
  } finally {
    isLoading.value = false;
  }
};

const openEditor = (friend) => {
  editingItem.value = friend;
  Object.assign(editForm, {
    id: friend.id,
    nickname: friend.nickname || '',
    site_name: friend.site_name || '',
    site_url: friend.site_url || '',
    site_description: friend.site_description || '',
    application_message: friend.application_message || '',
    contact_email: friend.contact_email || '',
    logo_url: friend.logo_url || '',
    status: friend.status || 'pending',
    admin_note: friend.admin_note || '',
    display_order: Number(friend.display_order || 0),
  });
};

const closeEditor = () => {
  editingItem.value = null;
};

const quickUpdateStatus = async (friend, status) => {
  await updateFriend({
    ...friend,
    status,
  });
};

const updateFriend = async (payload) => {
  try {
    isSaving.value = true;
    const response = await axios.put(`${API_BASE}/friends`, payload, {
      headers: getAuthHeaders(),
    });
    if (response.data?.success) {
      setFeedback(true, '友链已更新');
      await fetchFriends();
      window.dispatchEvent(new CustomEvent('friends-updated'));
    }
  } catch (error) {
    console.error('更新友链失败:', error);
    setFeedback(false, error.response?.data?.error || '更新失败，请稍后重试。');
  } finally {
    isSaving.value = false;
  }
};

const saveFriend = async () => {
  if (!editForm.id) return;
  await updateFriend({
    id: editForm.id,
    nickname: editForm.nickname,
    site_name: editForm.site_name,
    site_url: editForm.site_url,
    site_description: editForm.site_description,
    application_message: editForm.application_message,
    contact_email: editForm.contact_email,
    logo_url: editForm.logo_url,
    status: editForm.status,
    admin_note: editForm.admin_note,
    display_order: editForm.display_order,
  });
  closeEditor();
};

const deleteFriend = async (friend) => {
  if (!confirm(`确定删除友链「${friend.site_name}」吗？`)) return;
  try {
    isLoading.value = true;
    const response = await axios.delete(`${API_BASE}/friends?id=${friend.id}`, {
      headers: getAuthHeaders(),
    });
    if (response.data?.success) {
      setFeedback(true, '友链已删除');
      await fetchFriends();
      window.dispatchEvent(new CustomEvent('friends-updated'));
    }
  } catch (error) {
    console.error('删除友链失败:', error);
    setFeedback(false, error.response?.data?.error || '删除失败，请稍后重试。');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFriends();
});
</script>

<style scoped>
.admin-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(122, 162, 247, 0.3);
  padding: 0.6rem 0.85rem;
  outline: none;
  transition: all 0.2s ease;
}

.dark .admin-input {
  background: rgba(41, 46, 66, 0.85);
  color: #fff;
}

.light .admin-input {
  background: #fff;
  color: #111827;
}

.admin-input:focus {
  border-color: rgba(125, 207, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(125, 207, 255, 0.18);
}
</style>
