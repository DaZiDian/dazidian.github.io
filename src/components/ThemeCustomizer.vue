<template>
  <button
    @click="showPanel = !showPanel"
    class="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
    :class="isDark
      ? 'bg-tokyo-night-blue text-white hover:bg-tokyo-night-cyan'
      : 'bg-blue-600 text-white hover:bg-blue-700'"
    title="主题设置"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  </button>

  <div
    v-if="showPanel"
    class="fixed bottom-24 right-6 z-50 w-[25rem] max-w-[calc(100vw-1.5rem)] max-h-[82vh] overflow-y-auto glass-effect rounded-2xl p-6 shadow-2xl"
    :class="isDark ? 'bg-tokyo-night-bg/95' : 'bg-white/95'"
  >
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
        调色盘
      </h3>
      <button @click="showPanel = false" class="text-gray-500 hover:text-gray-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-3 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
          昼夜模式
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="setTheme('dark')"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="isDark
              ? 'bg-tokyo-night-blue text-white'
              : (isDark ? 'bg-tokyo-night-bg-highlight text-gray-200' : 'bg-gray-100 text-gray-700')"
          >
            黑夜模式
          </button>
          <button
            @click="setTheme('light')"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="!isDark
              ? 'bg-blue-600 text-white'
              : (isDark ? 'bg-tokyo-night-bg-highlight text-gray-200' : 'bg-gray-100 text-gray-700')"
          >
            白昼模式
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-3 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
          黑夜预设方案（10套）
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="palette in availablePalettes"
            :key="palette.id"
            @click="setPalette(palette.id)"
            class="rounded-lg px-3 py-2 text-left transition-all border"
            :class="currentPalette === palette.id
              ? (isDark ? 'border-tokyo-night-cyan bg-tokyo-night-bg-highlight' : 'border-blue-500 bg-blue-50')
              : (isDark ? 'border-tokyo-night-blue/30 bg-tokyo-night-bg-highlight/60 hover:border-tokyo-night-cyan/70' : 'border-gray-200 bg-white hover:border-blue-300')"
          >
            <div class="flex items-center gap-2 mb-1">
              <span
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: palette.colors['tokyo-night-blue'] }"
              ></span>
              <span
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: palette.colors['tokyo-night-cyan'] }"
              ></span>
              <span
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: palette.colors['tokyo-night-magenta'] }"
              ></span>
            </div>
            <p class="text-sm font-medium transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
              {{ palette.name }}
            </p>
            <p class="text-xs transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ palette.description }}
            </p>
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-3 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
          字体设置
        </label>
        <select
          v-model="settings.fontFamily"
          @change="applyAdvancedSettings"
          class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          :class="isDark
            ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white'
            : 'bg-white border-gray-300 text-gray-900'"
        >
          <option value="system">系统默认</option>
          <option value="serif">衬线字体</option>
          <option value="sans-serif">无衬线字体</option>
          <option value="monospace">等宽字体</option>
          <option value="custom">自定义字体</option>
        </select>
        <input
          v-if="settings.fontFamily === 'custom'"
          v-model="settings.customFont"
          @input="applyAdvancedSettings"
          placeholder="例如: 'Microsoft YaHei', Arial"
          class="w-full mt-2 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          :class="isDark
            ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white'
            : 'bg-white border-gray-300 text-gray-900'"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-3 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
          自定义 CSS
        </label>
        <textarea
          v-model="settings.customCSS"
          @input="applyAdvancedSettings"
          rows="4"
          placeholder=".card-hover { border-radius: 2rem; }"
          class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
          :class="isDark
            ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue text-white'
            : 'bg-white border-gray-300 text-gray-900'"
        ></textarea>
      </div>

      <div class="flex gap-3">
        <button
          @click="resetSettings"
          class="flex-1 px-4 py-2 rounded-lg border font-medium transition-all"
          :class="isDark
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
        >
          重置
        </button>
        <button
          @click="saveSettings"
          class="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all"
          :class="isDark
            ? 'bg-tokyo-night-blue hover:bg-tokyo-night-cyan'
            : 'bg-blue-600 hover:bg-blue-700'"
        >
          保存
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showPanel"
    @click="showPanel = false"
    class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
  ></div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useTheme } from '../composables/useTheme';

const { isDark, setTheme, setPalette, currentPalette, availablePalettes } = useTheme();

const showPanel = ref(false);

const defaultSettings = {
  fontFamily: 'system',
  customFont: '',
  customCSS: '',
};

const settings = reactive({ ...defaultSettings });

const applyAdvancedSettings = () => {
  const styleId = 'theme-customizer-style';
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  let css = '';
  if (settings.fontFamily === 'custom' && settings.customFont.trim()) {
    css += `* { font-family: ${settings.customFont}, sans-serif !important; }\n`;
  } else if (settings.fontFamily !== 'system') {
    const fontMap = {
      serif: 'Georgia, "Times New Roman", serif',
      'sans-serif': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      monospace: '"JetBrains Mono", "Courier New", monospace',
    };
    css += `* { font-family: ${fontMap[settings.fontFamily]} !important; }\n`;
  }

  if (settings.customCSS.trim()) {
    css += `${settings.customCSS}\n`;
  }

  styleEl.textContent = css;
};

const loadSettings = () => {
  const saved = localStorage.getItem('themeCustomizer');
  if (!saved) {
    applyAdvancedSettings();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    Object.assign(settings, defaultSettings, parsed);
  } catch (error) {
    console.error('加载个性化设置失败:', error);
    Object.assign(settings, defaultSettings);
  }
  applyAdvancedSettings();
};

const saveSettings = () => {
  localStorage.setItem('themeCustomizer', JSON.stringify(settings));
};

const resetSettings = () => {
  Object.assign(settings, defaultSettings);
  localStorage.removeItem('themeCustomizer');
  setPalette('tokyo-night');
  applyAdvancedSettings();
};

onMounted(() => {
  loadSettings();
});
</script>
