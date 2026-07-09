<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
        邮件协议配置
      </h2>
      <button
        @click="fetchSettings"
        :disabled="isLoading"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
        :class="isDark
          ? 'bg-tokyo-night-bg-highlight text-tokyo-night-cyan hover:bg-tokyo-night-blue'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
      >
        {{ isLoading ? '加载中...' : '刷新' }}
      </button>
    </div>

    <div v-if="feedback.message" class="rounded-xl p-3 text-sm" :class="feedback.success ? successClass : errorClass">
      {{ feedback.message }}
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div
        v-for="protocol in protocols"
        :key="protocol"
        class="glass-effect rounded-2xl p-5"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold uppercase tracking-wide transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-700'">
            {{ protocol }}
          </h3>
          <label class="inline-flex items-center gap-2 text-sm">
            <input
              v-model="forms[protocol].enabled"
              type="checkbox"
              class="w-4 h-4 rounded"
            />
            启用
          </label>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-sm mb-1">服务器地址</label>
            <input v-model="forms[protocol].host" type="text" class="admin-input" placeholder="mail.example.com" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm mb-1">端口</label>
              <input v-model.number="forms[protocol].port" type="number" class="admin-input" />
            </div>
            <div class="flex items-end pb-2">
              <label class="inline-flex items-center gap-2 text-sm">
                <input v-model="forms[protocol].secure" type="checkbox" class="w-4 h-4 rounded" />
                SSL/TLS
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm mb-1">用户名</label>
            <input v-model="forms[protocol].username" type="text" class="admin-input" />
          </div>

          <div>
            <label class="block text-sm mb-1">
              密码
              <span v-if="forms[protocol].has_password" class="text-xs opacity-70">(留空保持不变)</span>
            </label>
            <input v-model="forms[protocol].password" type="password" class="admin-input" />
          </div>

          <template v-if="protocol === 'smtp'">
            <div>
              <label class="block text-sm mb-1">发件人名称</label>
              <input v-model="forms[protocol].from_name" type="text" class="admin-input" />
            </div>
            <div>
              <label class="block text-sm mb-1">发件邮箱</label>
              <input v-model="forms[protocol].from_email" type="email" class="admin-input" />
            </div>
            <div>
              <label class="block text-sm mb-1">管理员收件邮箱</label>
              <input
                v-model="forms[protocol].admin_receiver_email"
                type="email"
                class="admin-input"
                placeholder="例如：dazidian@vip.qq.com"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">邮件标题模板</label>
              <input
                v-model="forms[protocol].subject_template"
                type="text"
                class="admin-input"
                placeholder="{{nickname}} - {{site_name}} - 友链申请"
              />
              <p class="text-xs mt-1 opacity-75" v-pre>支持变量：{{nickname}}、{{site_name}}</p>
            </div>
            <div>
              <label class="block text-sm mb-1">管理员通知模板（用户申请时）</label>
              <textarea
                v-model="forms[protocol].admin_template"
                rows="5"
                class="admin-input resize-y"
              ></textarea>
              <p class="text-xs mt-1 opacity-75" v-pre>
                支持变量：{{nickname}}、{{site_name}}、{{site_url}}、{{contact_email}}、{{application_message}}
              </p>
            </div>
            <div>
              <label class="block text-sm mb-1">用户审核结果模板</label>
              <textarea
                v-model="forms[protocol].review_template"
                rows="5"
                class="admin-input resize-y"
              ></textarea>
              <p class="text-xs mt-1 opacity-75" v-pre>
                支持变量：{{review_status}}、{{admin_note}}、{{nickname}}、{{site_name}}
              </p>
            </div>
          </template>

          <template v-else>
            <div>
              <label class="block text-sm mb-1">收件箱目录</label>
              <input v-model="forms[protocol].inbox_folder" type="text" class="admin-input" placeholder="INBOX" />
            </div>
            <div>
              <label class="block text-sm mb-1">轮询间隔（分钟）</label>
              <input v-model.number="forms[protocol].poll_interval" type="number" min="1" class="admin-input" />
            </div>
          </template>

          <button
            @click="saveProtocol(protocol)"
            :disabled="isSaving"
            class="w-full mt-2 px-4 py-2 rounded-lg text-white transition-all disabled:opacity-60"
            :class="isDark ? 'bg-tokyo-night-blue hover:bg-tokyo-night-blue0' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ isSaving ? '保存中...' : `保存 ${protocol.toUpperCase()} 配置` }}
          </button>
        </div>
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
const protocols = ['smtp', 'imap', 'pop3'];

const isLoading = ref(false);
const isSaving = ref(false);
const feedback = ref({
  success: false,
  message: '',
});

const createEmptyForm = (protocol) => ({
  protocol,
  enabled: false,
  host: '',
  port: protocol === 'smtp' ? 587 : protocol === 'imap' ? 993 : 995,
  secure: protocol !== 'smtp',
  username: '',
  password: '',
  has_password: false,
  from_name: protocol === 'smtp' ? 'DaZiDian' : '',
  from_email: protocol === 'smtp' ? 'dazidian2007@163.com' : '',
  admin_receiver_email: protocol === 'smtp' ? 'dazidian@vip.qq.com' : '',
  subject_template: protocol === 'smtp' ? '{{nickname}} - {{site_name}} - 友链申请' : '',
  admin_template: protocol === 'smtp'
    ? '您好，管理员：\n\n收到新的友情链接申请，请及时审核。\n\n昵称：{{nickname}}\n站点名称：{{site_name}}\n站点链接：{{site_url}}\n联系邮箱：{{contact_email}}\n用户申请留言：{{application_message}}\n\nDaZiDian & DSMCC ©2007-present All Copyrights Reserved.'
    : '',
  review_template: protocol === 'smtp'
    ? '您好，您在dz1d.vip申请的友情链接现已{{review_status}}\n附言：\n{{admin_note}}\nDaZiDian & DSMCC ©2007-present All Copyrights Reserved.'
    : '',
  inbox_folder: 'INBOX',
  poll_interval: 5,
});

const forms = reactive({
  smtp: createEmptyForm('smtp'),
  imap: createEmptyForm('imap'),
  pop3: createEmptyForm('pop3'),
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

const setFeedback = (success, message) => {
  feedback.value = { success, message };
};

const mergeForm = (protocol, item = {}) => {
  forms[protocol].protocol = protocol;
  forms[protocol].enabled = Boolean(item.enabled);
  forms[protocol].host = item.host || '';
  forms[protocol].port = Number(item.port || forms[protocol].port || 0);
  forms[protocol].secure = Boolean(item.secure);
  forms[protocol].username = item.username || '';
  forms[protocol].password = '';
  forms[protocol].has_password = Boolean(item.has_password);
  forms[protocol].from_name = item.from_name || '';
  forms[protocol].from_email = item.from_email || '';
  forms[protocol].admin_receiver_email = item.admin_receiver_email || forms[protocol].admin_receiver_email || '';
  forms[protocol].subject_template = item.subject_template || forms[protocol].subject_template || '';
  forms[protocol].admin_template = item.admin_template || forms[protocol].admin_template || '';
  forms[protocol].review_template = item.review_template || forms[protocol].review_template || '';
  forms[protocol].inbox_folder = item.inbox_folder || 'INBOX';
  forms[protocol].poll_interval = Number(item.poll_interval || 5);
};

const fetchSettings = async () => {
  try {
    isLoading.value = true;
    setFeedback(false, '');
    const response = await axios.get(`${API_BASE}/settings/mail`, {
      headers: getAuthHeaders(),
    });
    if (response.data?.success && Array.isArray(response.data.data)) {
      protocols.forEach((protocol) => mergeForm(protocol, {}));
      response.data.data.forEach((item) => {
        if (protocols.includes(item.protocol)) {
          mergeForm(item.protocol, item);
        }
      });
    }
  } catch (error) {
    console.error('加载邮件配置失败:', error);
    setFeedback(false, error.response?.data?.error || '加载失败，请稍后重试。');
  } finally {
    isLoading.value = false;
  }
};

const saveProtocol = async (protocol) => {
  try {
    isSaving.value = true;
    const payload = {
      protocol,
      enabled: forms[protocol].enabled,
      host: forms[protocol].host,
      port: forms[protocol].port,
      secure: forms[protocol].secure,
      username: forms[protocol].username,
      password: forms[protocol].password,
      from_name: forms[protocol].from_name,
      from_email: forms[protocol].from_email,
      admin_receiver_email: forms[protocol].admin_receiver_email,
      subject_template: forms[protocol].subject_template,
      admin_template: forms[protocol].admin_template,
      review_template: forms[protocol].review_template,
      inbox_folder: forms[protocol].inbox_folder,
      poll_interval: forms[protocol].poll_interval,
    };

    const response = await axios.put(`${API_BASE}/settings/mail`, payload, {
      headers: getAuthHeaders(),
    });

    if (response.data?.success) {
      setFeedback(true, response.data.message || `${protocol.toUpperCase()} 配置已更新`);
      forms[protocol].password = '';
      forms[protocol].has_password = true;
    }
  } catch (error) {
    console.error('保存邮件配置失败:', error);
    setFeedback(false, error.response?.data?.error || '保存失败，请稍后重试。');
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>

<style scoped>
.admin-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(122, 162, 247, 0.3);
  padding: 0.6rem 0.8rem;
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
