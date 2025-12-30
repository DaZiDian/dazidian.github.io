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
          class="glass-effect rounded-3xl p-8 card-hover scroll-animate relative overflow-hidden group card-with-bg"
        >
          <div 
            class="card-bg-image"
            :style="{ backgroundImage: `url(/img/Qingdao.png)` }"
          ></div>
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
            
            <div class="space-y-6">
              <!-- 笔记本 -->
              <div>
                <p class="font-bold text-lg mb-2 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'"><img alt="Static Badge" src="https://img.shields.io/badge/Lenovo-%23E2231A.svg?logo=Lenovo&logoColor=white"> Lenovo Thinkbook 16+ 2025</p>
                <ul class="space-y-1 text-sm ml-4 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                  <li><img alt="Static Badge" src="https://img.shields.io/badge/Intel-%230071C5.svg?logo=intel&logoColor=white"> Intel® Core™ Ultra 9 285H</li>
                  <li><img alt="Static Badge" src="https://img.shields.io/badge/NVIDIA-%2376B900.svg?logo=nvidia&logoColor=white"> NVIDIA GeForce RTX 5060 Laptop</li>
                  <li><img alt="Static Badge" src="https://img.shields.io/badge/Samsung-%231428A0.svg?logo=Samsung&logoColor=white"> Samsung DDR5 16G*2 5600MHz</li>
                  <li><img alt="Static Badge" src="https://img.shields.io/badge/UMIS-%23E2231A.svg?logo=Lenovo&logoColor=white"> UMIS RPJYJ1T24RLS1QWY</li>
                  <li><img alt="Static Badge" src="https://img.shields.io/badge/Kingston-%23000000.svg?logo=kingston%20technology&logoColor=white">KINGSTON SNV2S1000G</li>
                </ul>
              </div>

              <!-- 手机 -->
              <div>
                <p class="font-bold text-lg mb-2 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'"><img alt="Static Badge" src="https://img.shields.io/badge/Xiaomi-%23FF6900.svg?logo=Xiaomi&logoColor=white">
Xiaomi 12S Ultra</p>
                <p class="text-sm ml-4 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Black 12+256G</p>
              </div>

              <!-- 家庭服务器 -->
              <div>
                <p class="font-bold text-lg mb-2 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
                  <img src="/img/cloud-server.png" alt="server" class="inline w-6 h-6 mr-2" />
                  HomeLab Server
                </p>
                <ul class="space-y-1 text-sm ml-4 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                  <li>• AMD® Ryzen™ 7 5700X</li>
                  <li>• Thermalright AQUA ELITE 360</li>
                  <li>• ADATA XPG 16G*4 DDR4 3600MHz</li>
                  <li>• NVIDIA Tesla T4 16GB</li>
                  <li>• WD Blue SSD 1TB</li>
                </ul>
                <p class="font-bold text-lg mb-2 transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">
                  <img src="/img/cloud-server.png" alt="server" class="inline w-6 h-6 mr-2" />
                  (FUTURE)DSMCC Server
                </p>
                <ul class="space-y-1 text-sm ml-4 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                  <li>• AMD® Ryzen™ 9 9950X</li>
                  <li>• Thermalright AQUA ELITE 360</li>
                  <li>• ADATA XPG 32G*4 DDR5 6000MHz</li>
                  <li>• NVIDIA GeForce RTX 5080 16GB</li>
                  <li>• Intel® Optane™ SSD P5801X 800GB</li>
                  <li>• WD Black SSD 2TB</li>
                  <li>• WD Blue HDD 4TB*4</li>
                </ul>
              </div>

              <!-- 外设 -->
              <div>
                <p class="font-bold transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">⌨ Royal Kludge R98</p>
                <p class="font-bold transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">🖱 Logitech G502 SE HERO</p>
                <p class="font-bold transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">🎧 EDIFIER Fit900NB</p>
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

