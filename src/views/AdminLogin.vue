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
              maxlength="128"
              autocomplete="current-password"
              placeholder="请输入管理员密码"
              class="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              :class="isDark
                ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading || isThrottled"
            class="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-60"
            :class="isDark ? 'bg-tokyo-night-blue hover:bg-tokyo-night-blue0' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ isLoading ? '验证中...' : isThrottled ? `请等待 ${throttleCountdown}s` : '进入后台' }}
          </button>
        </form>

        <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500">
          {{ errorMessage }}
        </p>

        <!-- 安全: 登录失败次数提示 -->
        <p v-if="failedAttempts >= 3" class="mt-2 text-xs text-center text-amber-500">
          连续登录失败 {{ failedAttempts }} 次，请确认密码后重试
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useTheme } from '../composables/useTheme';
import { sanitizeRedirectPath } from '../router/index.js';

const { isDark } = useTheme();
const route = useRoute();
const router = useRouter();

const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const failedAttempts = ref(0);
const isThrottled = ref(false);
const throttleCountdown = ref(0);
let throttleTimer = null;

/**
 * 安全: 登录后重定向 - 使用 sanitizeRedirectPath 防止开放重定向
 */
const redirectAfterLogin = () => {
  const rawRedirect = String(route.query.redirect || '/admin');
  const safeRedirect = sanitizeRedirectPath(rawRedirect);
  router.replace(safeRedirect);
};

/**
 * 安全: 登录失败后的客户端节流 - 防止暴力破解
 * 符合等保3.0 - 身份鉴别、入侵防范
 */
const startThrottle = () => {
  // 失败次数越多，等待时间越长（指数退避，上限 30 秒）
  const waitSeconds = Math.min(Math.pow(2, failedAttempts.value - 1), 30);
  throttleCountdown.value = waitSeconds;
  isThrottled.value = true;

  throttleTimer = setInterval(() => {
    throttleCountdown.value--;
    if (throttleCountdown.value <= 0) {
      isThrottled.value = false;
      clearInterval(throttleTimer);
      throttleTimer = null;
    }
  }, 1000);
};

const handleLogin = async () => {
  errorMessage.value = '';

  // 安全: 输入验证
  const pwd = password.value.trim();
  if (!pwd) {
    errorMessage.value = '密码不能为空';
    return;
  }
  if (pwd.length > 128) {
    errorMessage.value = '密码长度不能超过 128 个字符';
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post('/api/auth/login', {
      password: pwd,
    });

    if (response.data?.success && response.data?.data?.token) {
      localStorage.setItem('blog_admin_token', response.data.data.token);
      password.value = '';
      failedAttempts.value = 0;
      redirectAfterLogin();
      return;
    }

    failedAttempts.value++;
    errorMessage.value = response.data?.error || '登录失败，请重试。';
    if (failedAttempts.value >= 2) {
      startThrottle();
    }
  } catch (error) {
    failedAttempts.value++;
    errorMessage.value = error.response?.data?.error || '登录失败，请稍后重试。';
    if (failedAttempts.value >= 2) {
      startThrottle();
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // 安全: 验证已有 token 有效性再重定向
  const token = localStorage.getItem('blog_admin_token');
  if (token) {
    // 简单检查 JWT 格式和过期
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (payload.role === 'admin' && (!payload.exp || Math.floor(Date.now() / 1000) < payload.exp)) {
          redirectAfterLogin();
          return;
        }
      }
    } catch {
      // Token 解析失败，清除
    }
    localStorage.removeItem('blog_admin_token');
  }
});

onUnmounted(() => {
  if (throttleTimer) {
    clearInterval(throttleTimer);
    throttleTimer = null;
  }
});
</script>

