<template>
  <div class="pt-20 pb-12" :class="isDark ? 'dark' : 'light'">
    <div class="container mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-5xl font-bold mb-4 title-reveal">
          关于我 | ABOUT ME
        </h1>
      </div>

      <!-- 毛玻璃卡片网格布局 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
        <!-- 国家/地区卡片 -->
        <div 
          class="glass-effect rounded-3xl p-8 card-hover scroll-animate relative overflow-hidden group"
        >
          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-4 transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">国家或地区 | Country/Region</h3>
            <div class="space-y-2 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
              <p class="text-xl font-semibold">🇨🇳 中华人民共和国 | People's Republic of CHINA</p>
              <p class="text-lg">📍 山东省青岛市 | Qingdao, Shandong</p>
            </div>
          </div>
        </div>

        <!-- 个人信息卡片 -->
        <div 
          class="glass-effect rounded-3xl p-8 card-hover scroll-animate scroll-animate-delay-1 relative overflow-hidden group card-with-bg"
        >
          <div 
            class="card-bg-image"
            :style="{ backgroundImage: `url(/img/info personal.png)` }"
          ></div>
          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-4 transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">个人信息 | Personal Info</h3>
            <div class="space-y-3 text-lg transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
              <p>🎂 2007.3.26</p>
              <p>🩸 O</p>
              <p>😇 INTJ</p>
              <p>👀 5.2 / 5.3</p>
            </div>
          </div>
        </div>

        <!-- 设备信息卡片 - 占据更大空间 -->
        <div 
          class="glass-effect rounded-3xl p-8 card-hover scroll-animate scroll-animate-delay-2 relative overflow-hidden group card-with-bg md:col-span-2 lg:col-span-1 lg:row-span-2"
        >
          <div 
            class="card-bg-image"
            :style="{ 
              backgroundImage: `url(/img/Devices.png)`, 
              backgroundSize: '80%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center 60%'
            }"
          ></div>
          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-6 transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">我的设备 | My Devices</h3>
            
            <div class="flex flex-col gap-4">
              <!-- 笔记本 -->
              <div class="p-4 rounded-2xl glass-effect border transition-all hover:scale-[1.02]" :class="isDark ? 'border-tokyo-night-blue/20 bg-black/20' : 'border-gray-200 bg-white/50'">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">💻</span>
                  <p class="font-bold text-lg transition-colors flex-1" :class="isDark ? 'text-white' : 'text-gray-800'">Lenovo Thinkbook 16+ 2025</p>
                </div>
                <div class="flex flex-wrap gap-2 text-xs">
                  <span class="px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Intel Core Ultra 9 285H</span>
                  <span class="px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">RTX 5060 Laptop</span>
                  <span class="px-2 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">32GB DDR5 5600MHz</span>
                  <span class="px-2 py-1 rounded bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20">2TB SSD</span>
                </div>
              </div>

              <!-- 手机 -->
              <div class="p-4 rounded-2xl glass-effect border transition-all hover:scale-[1.02]" :class="isDark ? 'border-tokyo-night-orange/20 bg-black/20' : 'border-orange-200 bg-white/50'">
                <div class="flex items-center gap-2">
                  <span class="text-xl">📱</span>
                  <p class="font-bold text-lg transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">Xiaomi 12S Ultra</p>
                  <span class="ml-auto text-sm opacity-70">12+256G</span>
                </div>
              </div>

              <!-- 家庭服务器 -->
              <div class="p-4 rounded-2xl glass-effect border transition-all hover:scale-[1.02]" :class="isDark ? 'border-tokyo-night-cyan/20 bg-black/20' : 'border-cyan-200 bg-white/50'">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">🖧</span>
                  <p class="font-bold text-lg transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">HomeLab Server</p>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-cyan"></span> R7 5700X</div>
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-cyan"></span> 64G DDR4</div>
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-cyan"></span> Tesla T4 16G</div>
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-cyan"></span> 1TB SSD</div>
                </div>
              </div>

              <!-- Future Server -->
              <div class="p-4 rounded-2xl glass-effect border transition-all hover:scale-[1.02] border-dashed" :class="isDark ? 'border-tokyo-night-magenta/30 bg-black/10' : 'border-purple-300 bg-white/30'">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xl">🚀</span>
                  <p class="font-bold text-lg transition-colors" :class="isDark ? 'text-tokyo-night-magenta' : 'text-purple-600'">(FUTURE) DSMCC Server</p>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs opacity-80">
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-magenta"></span> R9 9950X</div>
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-magenta"></span> RTX 5080</div>
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-magenta"></span> 128G DDR5</div>
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-magenta"></span> 16TB HDD + Optane</div>
                </div>
              </div>

              <!-- 外设 -->
              <div class="flex gap-2 flex-wrap mt-2">
                <span class="px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors hover:scale-105 cursor-default" :class="isDark ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue/30 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'">⌨️ RK R98</span>
                <span class="px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors hover:scale-105 cursor-default" :class="isDark ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue/30 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'">🖱️ Logitech G502</span>
                <span class="px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors hover:scale-105 cursor-default" :class="isDark ? 'bg-tokyo-night-bg-highlight border-tokyo-night-blue/30 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'">🎧 EDIFIER Fit900NB</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 诗歌卡片 - 占据更大空间 -->
        <div 
          class="glass-effect rounded-3xl p-8 card-hover scroll-animate scroll-animate-delay-3 md:col-span-2"
        >
          <div class="text-center mb-6">
            <p class="text-lg italic transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              我不会写肉麻的话，就送你一首诗吧。
            </p>
          </div>
          
          <div class="space-y-4 leading-relaxed text-center transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
            <p>所有的结局都已写好</p>
            <p>所有的泪水也都已启程</p>
            <p>却忽然忘了是怎么样的一个开始</p>
            <p>在那个古老的不再回来的夏日</p>
            <p class="pt-2">无论我如何地去追索</p>
            <p>年轻的你只如云影掠过</p>
            <p>而你微笑的面容极浅极淡</p>
            <p>逐渐隐没在日落后的群岚</p>
            <p class="pt-2">遂翻开那发黄的扉页</p>
            <p>命运将它装订的极为拙劣</p>
            <p>含着泪 我一读再读</p>
            <p>却不得不承认</p>
            <p class="text-xl font-bold pt-2 signature-reveal">
              青春是一本太仓促的书
            </p>
          </div>
          
          <div class="text-right mt-6 text-sm italic transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            —— 席慕蓉《青春》
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { useScrollAnimation } from '../composables/useScrollAnimation'

const { isDark } = useTheme()
useScrollAnimation()
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

/* 页面标题 */
.dark .about-title {
  background: linear-gradient(90deg, #7aa2f7, #7dcfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #7aa2f7;
}

.light .about-title {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #2563eb;
}

/* 诗歌高亮文字 */
.dark .poem-highlight {
  background: linear-gradient(90deg, #7aa2f7, #7dcfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #7aa2f7;
}

.light .poem-highlight {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #2563eb;
}

/* 卡片背景图片悬浮效果 */
.card-with-bg .card-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s ease;
  transform: scale(1.1);
}

.dark .card-with-bg:hover .card-bg-image {
  opacity: 0.25;
  transform: scale(1);
}

.light .card-with-bg:hover .card-bg-image {
  opacity: 0.15;
  transform: scale(1);
}
</style>

