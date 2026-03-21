import { ref } from 'vue';

const THEME_STORAGE_KEY = 'theme';
const PALETTE_STORAGE_KEY = 'theme_palette';

const isDark = ref(true);
const currentPalette = ref('tokyo-night');

export const THEME_PRESETS = [
  {
    id: 'tokyo-night',
    name: '东京夜',
    description: '经典蓝紫冷色',
    colors: {
      'tokyo-night-bg': '#1a1b26',
      'tokyo-night-bg-dark': '#16161e',
      'tokyo-night-bg-highlight': '#292e42',
      'tokyo-night-fg': '#c0caf5',
      'tokyo-night-fg-dark': '#a9b1d6',
      'tokyo-night-dark5': '#737aa2',
      'tokyo-night-blue0': '#3d59a1',
      'tokyo-night-blue': '#7aa2f7',
      'tokyo-night-cyan': '#7dcfff',
      'tokyo-night-magenta': '#bb9af7',
      'tokyo-night-purple': '#9d7cd8',
      'tokyo-night-orange': '#ff9e64',
      'tokyo-night-yellow': '#e0af68',
      'tokyo-night-green': '#9ece6a',
      'tokyo-night-red': '#f7768e',
      'theme-glow': '#7dcfff',
    },
  },
  {
    id: 'aurora-ice',
    name: '极光冰川',
    description: '青蓝霓虹',
    colors: {
      'tokyo-night-bg': '#07131f',
      'tokyo-night-bg-dark': '#040c15',
      'tokyo-night-bg-highlight': '#113149',
      'tokyo-night-fg': '#d7eeff',
      'tokyo-night-fg-dark': '#9fc3dc',
      'tokyo-night-dark5': '#7aa2bc',
      'tokyo-night-blue0': '#0a74b8',
      'tokyo-night-blue': '#33a8ff',
      'tokyo-night-cyan': '#72ffe1',
      'tokyo-night-magenta': '#7aa8ff',
      'tokyo-night-purple': '#6899ff',
      'tokyo-night-orange': '#f6a83d',
      'tokyo-night-yellow': '#ffd166',
      'tokyo-night-green': '#71f7c5',
      'tokyo-night-red': '#ff7189',
      'theme-glow': '#72ffe1',
    },
  },
  {
    id: 'cyber-neon',
    name: '赛博霓虹',
    description: '高对比电子风',
    colors: {
      'tokyo-night-bg': '#0b0a14',
      'tokyo-night-bg-dark': '#06050d',
      'tokyo-night-bg-highlight': '#211d36',
      'tokyo-night-fg': '#efeaff',
      'tokyo-night-fg-dark': '#bfb5e6',
      'tokyo-night-dark5': '#8e86bf',
      'tokyo-night-blue0': '#3941db',
      'tokyo-night-blue': '#6d7dff',
      'tokyo-night-cyan': '#30f0ff',
      'tokyo-night-magenta': '#ff4ecb',
      'tokyo-night-purple': '#ad6fff',
      'tokyo-night-orange': '#ff9f4d',
      'tokyo-night-yellow': '#ffd35c',
      'tokyo-night-green': '#62ff92',
      'tokyo-night-red': '#ff5e87',
      'theme-glow': '#30f0ff',
    },
  },
  {
    id: 'crimson-eclipse',
    name: '绯红月蚀',
    description: '暗红+冷蓝平衡',
    colors: {
      'tokyo-night-bg': '#170d16',
      'tokyo-night-bg-dark': '#100710',
      'tokyo-night-bg-highlight': '#36203a',
      'tokyo-night-fg': '#f7dff1',
      'tokyo-night-fg-dark': '#d2b7cc',
      'tokyo-night-dark5': '#ac88a6',
      'tokyo-night-blue0': '#4f539e',
      'tokyo-night-blue': '#6d8cf7',
      'tokyo-night-cyan': '#82d8ff',
      'tokyo-night-magenta': '#ff7eb6',
      'tokyo-night-purple': '#d08bf7',
      'tokyo-night-orange': '#f29c67',
      'tokyo-night-yellow': '#e9bd74',
      'tokyo-night-green': '#8fd69a',
      'tokyo-night-red': '#ff637d',
      'theme-glow': '#ff7eb6',
    },
  },
  {
    id: 'emerald-forest',
    name: '翡翠深林',
    description: '绿青自然风',
    colors: {
      'tokyo-night-bg': '#081411',
      'tokyo-night-bg-dark': '#040d0b',
      'tokyo-night-bg-highlight': '#17332c',
      'tokyo-night-fg': '#dbf6e9',
      'tokyo-night-fg-dark': '#afd4c3',
      'tokyo-night-dark5': '#83ab9b',
      'tokyo-night-blue0': '#2c7f7a',
      'tokyo-night-blue': '#4db9a9',
      'tokyo-night-cyan': '#7ef7dc',
      'tokyo-night-magenta': '#95b8ff',
      'tokyo-night-purple': '#8ca9f0',
      'tokyo-night-orange': '#f6a65f',
      'tokyo-night-yellow': '#e8c97f',
      'tokyo-night-green': '#79e28d',
      'tokyo-night-red': '#ff7f8e',
      'theme-glow': '#7ef7dc',
    },
  },
  {
    id: 'cobalt-wave',
    name: '钴蓝浪潮',
    description: '深海蓝调',
    colors: {
      'tokyo-night-bg': '#0a1220',
      'tokyo-night-bg-dark': '#050b15',
      'tokyo-night-bg-highlight': '#1d3350',
      'tokyo-night-fg': '#dce7ff',
      'tokyo-night-fg-dark': '#adc2ea',
      'tokyo-night-dark5': '#8398c3',
      'tokyo-night-blue0': '#2b5fc1',
      'tokyo-night-blue': '#5599ff',
      'tokyo-night-cyan': '#5be5ff',
      'tokyo-night-magenta': '#8f98ff',
      'tokyo-night-purple': '#7f8fe0',
      'tokyo-night-orange': '#f3a26c',
      'tokyo-night-yellow': '#eccf88',
      'tokyo-night-green': '#79d7bc',
      'tokyo-night-red': '#f27a90',
      'theme-glow': '#5be5ff',
    },
  },
  {
    id: 'sunset-voltage',
    name: '落日电光',
    description: '橙粉活力感',
    colors: {
      'tokyo-night-bg': '#1a1110',
      'tokyo-night-bg-dark': '#120a09',
      'tokyo-night-bg-highlight': '#3c2320',
      'tokyo-night-fg': '#ffe9df',
      'tokyo-night-fg-dark': '#ddc0b6',
      'tokyo-night-dark5': '#b5958e',
      'tokyo-night-blue0': '#6468d5',
      'tokyo-night-blue': '#7b8cff',
      'tokyo-night-cyan': '#7ce8ff',
      'tokyo-night-magenta': '#ff8bbf',
      'tokyo-night-purple': '#d589ff',
      'tokyo-night-orange': '#ff9f5a',
      'tokyo-night-yellow': '#ffd26d',
      'tokyo-night-green': '#a3df7b',
      'tokyo-night-red': '#ff6f6f',
      'theme-glow': '#ff9f5a',
    },
  },
  {
    id: 'violet-storm',
    name: '紫电风暴',
    description: '高饱和紫青',
    colors: {
      'tokyo-night-bg': '#111022',
      'tokyo-night-bg-dark': '#090814',
      'tokyo-night-bg-highlight': '#29204a',
      'tokyo-night-fg': '#ece6ff',
      'tokyo-night-fg-dark': '#c4b8ee',
      'tokyo-night-dark5': '#9d92cb',
      'tokyo-night-blue0': '#4e56ca',
      'tokyo-night-blue': '#7287ff',
      'tokyo-night-cyan': '#63e8ff',
      'tokyo-night-magenta': '#d56fff',
      'tokyo-night-purple': '#a683ff',
      'tokyo-night-orange': '#f6a56a',
      'tokyo-night-yellow': '#ebd17b',
      'tokyo-night-green': '#86e7b1',
      'tokyo-night-red': '#ff7396',
      'theme-glow': '#d56fff',
    },
  },
  {
    id: 'graphite-noir',
    name: '石墨夜幕',
    description: '极简灰阶',
    colors: {
      'tokyo-night-bg': '#17191d',
      'tokyo-night-bg-dark': '#101217',
      'tokyo-night-bg-highlight': '#2a2e36',
      'tokyo-night-fg': '#e8edf5',
      'tokyo-night-fg-dark': '#b8bfcc',
      'tokyo-night-dark5': '#8d96a8',
      'tokyo-night-blue0': '#4d5f7a',
      'tokyo-night-blue': '#8ea4c9',
      'tokyo-night-cyan': '#9fd3dc',
      'tokyo-night-magenta': '#b7adc6',
      'tokyo-night-purple': '#9f95b2',
      'tokyo-night-orange': '#d6aa84',
      'tokyo-night-yellow': '#d9c796',
      'tokyo-night-green': '#9ec3a5',
      'tokyo-night-red': '#d2949f',
      'theme-glow': '#8ea4c9',
    },
  },
  {
    id: 'rose-moon',
    name: '玫瑰月影',
    description: '柔和粉青',
    colors: {
      'tokyo-night-bg': '#19131d',
      'tokyo-night-bg-dark': '#110b14',
      'tokyo-night-bg-highlight': '#32243a',
      'tokyo-night-fg': '#f9e5f0',
      'tokyo-night-fg-dark': '#d5b7ca',
      'tokyo-night-dark5': '#ac8ea2',
      'tokyo-night-blue0': '#5862bb',
      'tokyo-night-blue': '#88a2ff',
      'tokyo-night-cyan': '#93e8ff',
      'tokyo-night-magenta': '#f28fcb',
      'tokyo-night-purple': '#c79af1',
      'tokyo-night-orange': '#ffad74',
      'tokyo-night-yellow': '#efc97d',
      'tokyo-night-green': '#9addb8',
      'tokyo-night-red': '#ff789c',
      'theme-glow': '#f28fcb',
    },
  },
];

const getPresetById = (paletteId) =>
  THEME_PRESETS.find((item) => item.id === paletteId) || THEME_PRESETS[0];

const applyThemeClass = () => {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add('dark');
    html.classList.remove('light');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
  } else {
    html.classList.add('light');
    html.classList.remove('dark');
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
  }
};

const applyPaletteVariables = (paletteId) => {
  const preset = getPresetById(paletteId);
  const html = document.documentElement;
  Object.entries(preset.colors).forEach(([key, value]) => {
    html.style.setProperty(`--${key}`, value);
  });
  currentPalette.value = preset.id;
  localStorage.setItem(PALETTE_STORAGE_KEY, preset.id);
};

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyThemeClass();
  };

  const setTheme = (mode) => {
    isDark.value = mode === 'dark';
    applyThemeClass();
  };

  const setPalette = (paletteId) => {
    applyPaletteVariables(paletteId);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const savedPalette = localStorage.getItem(PALETTE_STORAGE_KEY);

    isDark.value = savedTheme ? savedTheme === 'dark' : true;
    applyThemeClass();
    applyPaletteVariables(savedPalette || 'tokyo-night');
  };

  return {
    isDark,
    currentPalette,
    availablePalettes: THEME_PRESETS,
    toggleTheme,
    setTheme,
    setPalette,
    initTheme,
  };
}
