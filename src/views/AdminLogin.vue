<template>
  <div class="min-h-screen pt-28 pb-12 px-4" :class="isDark ? 'dark' : 'light'">
    <div class="max-w-md mx-auto">
      <div class="glass-effect rounded-3xl p-8">
        <h1 class="text-3xl font-bold mb-2 title-reveal text-center">后台登录</h1>
        <p class="text-center mb-8 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
          输入管理员密码后进入管理台
        </p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
              管理员密码
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="请输入管理员密码"
              class="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              :class="isDark
                ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-60"
            :class="isDark ? 'bg-tokyo-night-blue hover:bg-tokyo-night-blue0' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ isLoading ? '验证中...' : '进入后台' }}
          </button>
        </form>

        <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useTheme } from '../composables/useTheme';

const { isDark } = useTheme();
const route = useRoute();
const router = useRouter();

const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const redirectAfterLogin = () => {
  const redirect = String(route.query.redirect || '/admin');
  router.replace(redirect);
};

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    isLoading.value = true;
    const response = await axios.post('/api/auth/login', {
      password: password.value,
    });

    if (response.data?.success && response.data?.data?.token) {
      localStorage.setItem('blog_admin_token', response.data.data.token);
      password.value = '';
      redirectAfterLogin();
      return;
    }

    errorMessage.value = response.data?.error || '登录失败，请重试。';
  } catch (error) {
    console.error('登录失败:', error);
    errorMessage.value = error.response?.data?.error || '登录失败，请稍后重试。';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const token = localStorage.getItem('blog_admin_token');
  if (token) {
    redirectAfterLogin();
  }
});
</script>
