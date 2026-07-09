<template>
  <div class="pt-20 pb-12">
    <div class="container mx-auto px-4">
      <!-- Hero Section -->
      <section class="mb-16 text-center">
        <div class="flex flex-col items-center justify-center gap-6 mb-8">
          <img src="https://raw.githubusercontent.com/DaZiDian/DaZiDian/main/me.gif" alt="header" class="max-w-full rounded-3xl shadow-2xl mb-4 hover:scale-[1.01] transition-transform duration-500" />
          
          <img src="/img/LOGO.jpg" alt="Logo" class="w-32 h-32 rounded-full ring-4 ring-tokyo-night-blue shadow-2xl animate-scale-in hover:rotate-12 transition-transform duration-500" />
          
          <div class="text-center w-full flex flex-col items-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in signature-reveal mt-2">
              Hello, I'm DaZiDian~
            </h1>
            
            <a href="https://git.io/typing-svg" class="inline-block mb-6 w-full max-w-3xl overflow-hidden flex justify-center">
              <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=20&duration=3000&pause=500&color=3B82F6&center=true&vCenter=true&width=760&lines=%E6%98%A5%E9%A2%A8%E8%8B%A5%E6%9C%89%E6%86%90%E8%8A%B1%E6%84%8F%EF%BC%8C%E5%8F%AF%E5%90%A6%E8%A8%B1%E6%88%91%E5%86%8D%E5%B0%91%E5%B9%B4%EF%BC%9F;SDCIT+Student+%7C+Cybersecurity+%26+Network+Tech;Microsoft+Student+Ambassador;Minecraft+Server+Dev+%26+Technical+Survival;Building+DSReplay+%26+AR+Assistive+Software" alt="Typing SVG" class="max-w-full h-auto">
            </a>

            <div class="flex flex-wrap justify-center gap-4 animate-fade-in">
              <a href="#" class="hover:scale-105 transition-transform hover:shadow-lg rounded">
                <img src="https://img.shields.io/badge/Student-Shandong_Vocational_College_of_Information_Technology-1e40af?style=for-the-badge&logo=minutemailer&logoColor=white" alt="Profile" class="h-8 md:h-10 rounded" />
              </a>
              <a href="#" class="hover:scale-105 transition-transform hover:shadow-lg rounded">
                <img src="https://img.shields.io/badge/Microsoft-Student_Ambassador-00a4ef?style=for-the-badge&logo=microsoft&logoColor=white" alt="MSA" class="h-8 md:h-10 rounded" />
              </a>
              <a href="#-core-stack" class="hover:scale-105 transition-transform hover:shadow-lg rounded">
                <img src="https://img.shields.io/badge/Focus-Cybersecurity_%26_Dev-8b5cf6?style=for-the-badge&logo=security&logoColor=white" alt="Focus" class="h-8 md:h-10 rounded" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ⚡ 关于我 | About Me -->
      <section class="mb-12">
        <div class="glass-effect rounded-3xl p-8 card-hover scroll-animate">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-4 border-b pb-4" :class="isDark ? 'border-tokyo-night-blue/30' : 'border-blue-200'">
            <span class="text-4xl">⚡</span>
            <span class="title-reveal">关于我 | About Me</span>
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div class="space-y-6">
              <h3 class="text-2xl font-bold transition-colors flex items-center gap-2" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">
                <span class="w-2 h-6 rounded-full bg-current block"></span>
                Who Am I?
              </h3>
              <ul class="space-y-5 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                <li class="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 transition-colors" :class="isDark ? 'hover:bg-white/5' : ''">
                  <span class="text-2xl mt-1">🏫</span>
                  <div>
                    <p class="font-medium text-lg leading-snug">Currently studying at <b :class="isDark ? 'text-white' : 'text-black'">SDCIT</b>, majoring in Network Security Technology.</p>
                    <p class="text-sm opacity-80 italic mt-1 text-tokyo-night-blue">SDCIT在校生，主修网络安全技术。</p>
                  </div>
                </li>
                <li class="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 transition-colors" :class="isDark ? 'hover:bg-white/5' : ''">
                  <span class="text-2xl mt-1">🛡️</span>
                  <div>
                    <p class="font-medium text-lg leading-snug">Focused on cybersecurity, penetration testing, firewall, data recovery, and server O&M.</p>
                    <p class="text-sm opacity-80 italic mt-1 text-tokyo-night-magenta">专注于网络安全、渗透测试、防火墙、数据恢复及服务器运维。</p>
                  </div>
                </li>
                <li class="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 transition-colors" :class="isDark ? 'hover:bg-white/5' : ''">
                  <span class="text-2xl mt-1">⛏️</span>
                  <div>
                    <p class="font-medium text-lg leading-snug">A Minecraft Developer, deeply involved in TMC. Familiar with Folia, Velocity; Co-Founder and CEO of DarkStation.</p>
                    <p class="text-sm opacity-80 italic mt-1 text-tokyo-night-green">深耕技术生存（生电），熟悉 Folia、Velocity 等高并发架构，DarkStation 联合创始人兼首席执行官。</p>
                  </div>
                </li>
                <li class="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 transition-colors" :class="isDark ? 'hover:bg-white/5' : ''">
                  <span class="text-2xl mt-1">🌟</span>
                  <div>
                    <p class="font-medium text-lg leading-snug">Microsoft Student Ambassador. Dedicated to AI, Big Data, and AR assistive software.</p>
                    <p class="text-sm opacity-80 italic mt-1 text-tokyo-night-yellow">微软学生大使，致力于 AI、大数据及 AR 辅助软件系统的开发。</p>
                  </div>
                </li>
                <li class="flex items-start gap-4 p-3 rounded-xl hover:bg-black/5 transition-colors" :class="isDark ? 'hover:bg-white/5' : ''">
                  <span class="text-2xl mt-1">🎮</span>
                  <div>
                    <p class="font-medium text-lg leading-snug">Love Minecraft, FPS, sandbox games, and Goose Goose Duck.</p>
                    <p class="text-sm opacity-80 italic mt-1 text-tokyo-night-cyan">热爱 Minecraft、FPS、沙盒游戏以及与社区朋友开黑 Goose Goose Duck。</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="flex flex-col">
              <h3 class="text-2xl font-bold transition-colors mb-6 flex items-center gap-2" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">
                <span class="w-2 h-6 rounded-full bg-current block"></span>
                Current Signal
              </h3>
              <div class="rounded-2xl p-6 md:p-8 font-mono text-[15px] leading-relaxed shadow-xl border relative overflow-hidden flex-1 flex flex-col justify-center"
                   :class="isDark ? 'bg-[#1a1b26] text-[#a9b1d6] border-[#292e42]' : 'bg-white text-gray-800 border-gray-200'">
                <!-- Terminal decorative header -->
                <div class="absolute top-0 left-0 w-full h-8 flex items-center px-4 gap-2" :class="isDark ? 'bg-[#16161e]' : 'bg-gray-100'">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div class="mt-4 space-y-4">
                  <div class="flex flex-col sm:flex-row sm:items-center border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-100'">
                    <span class="w-32 font-bold text-tokyo-night-magenta">Role</span>
                    <span :class="isDark ? 'text-white' : 'text-black'">Cybersec Engineer / Server Dev</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:items-center border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-100'">
                    <span class="w-32 font-bold text-tokyo-night-blue">Focus</span>
                    <span :class="isDark ? 'text-white' : 'text-black'">Web Sec / Big Data / AI</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:items-center border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-100'">
                    <span class="w-32 font-bold text-tokyo-night-green">Languages</span>
                    <span :class="isDark ? 'text-white' : 'text-black'">Java / JS / C++ / Rust / Python</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:items-center border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-100'">
                    <span class="w-32 font-bold text-tokyo-night-yellow">Tools</span>
                    <span :class="isDark ? 'text-white' : 'text-black'">VS Code / IntelliJ / Linux</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:items-center border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-100'">
                    <span class="w-32 font-bold text-tokyo-night-cyan">Timezone</span>
                    <span :class="isDark ? 'text-white' : 'text-black'">Asia/Shanghai</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:items-center">
                    <span class="w-32 font-bold text-tokyo-night-red">Contact</span>
                    <span class="text-tokyo-night-blue hover:underline cursor-pointer" :class="isDark ? 'text-blue-400' : 'text-blue-600'">daz1d1an (Discord/TG)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 🧩 核心技术栈 | Core Stack -->
      <section class="mb-12" id="-core-stack">
        <div class="glass-effect rounded-3xl p-8 card-hover scroll-animate scroll-animate-delay-1">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-4 border-b pb-4" :class="isDark ? 'border-tokyo-night-blue/30' : 'border-blue-200'">
            <span class="text-4xl">🧩</span>
            <span class="title-reveal">核心技术栈 | Core Stack</span>
          </h2>
          
          <div class="flex flex-wrap justify-center gap-4 mb-10 p-6 rounded-2xl bg-black/5" :class="isDark ? 'bg-white/5' : ''">
            <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/C%23-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="C#" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/Go-00b0d6?style=for-the-badge&logo=go&logoColor=white" alt="Go" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
            <img src="https://img.shields.io/badge/ArkTS-FF0000?style=for-the-badge&logo=huawei&logoColor=white" alt="ArkTS" class="h-10 hover:scale-110 transition-transform shadow-md rounded" />
          </div>

          <!-- Technical Architecture Map -->
          <div class="p-8 rounded-3xl border shadow-lg" :class="isDark ? 'bg-[#1a1b26]/80 border-tokyo-night-blue/30' : 'bg-white border-blue-100'">
            <h3 class="text-2xl font-bold mb-8 text-center transition-colors tracking-wide" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-700'">Technical Architecture Map</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              
              <!-- Cybersecurity -->
              <div class="p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl group" :class="isDark ? 'bg-black/20 border-tokyo-night-red/20 hover:border-tokyo-night-red/50' : 'bg-red-50/50 border-red-100 hover:border-red-300'">
                <div class="flex items-center gap-3 mb-4 border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
                  <div class="w-10 h-10 rounded-xl bg-tokyo-night-red/20 flex items-center justify-center text-tokyo-night-red group-hover:scale-110 transition-transform">🛡️</div>
                  <div class="font-bold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">Cybersecurity</div>
                </div>
                <ul class="space-y-3" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-red"></span> Web Security & WAF</li>
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-red"></span> Penetration Testing</li>
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-red"></span> Data Recovery</li>
                </ul>
              </div>

              <!-- Server O&M -->
              <div class="p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl group" :class="isDark ? 'bg-black/20 border-tokyo-night-blue/20 hover:border-tokyo-night-blue/50' : 'bg-blue-50/50 border-blue-100 hover:border-blue-300'">
                <div class="flex items-center gap-3 mb-4 border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
                  <div class="w-10 h-10 rounded-xl bg-tokyo-night-blue/20 flex items-center justify-center text-tokyo-night-blue group-hover:scale-110 transition-transform">🖥️</div>
                  <div class="font-bold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">Server O&M</div>
                </div>
                <ul class="space-y-3" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-blue"></span> Linux Administration</li>
                  <li class="flex flex-col gap-2">
                    <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-blue"></span> Minecraft Server Dev</div>
                    <ul class="ml-6 space-y-2 opacity-80 text-sm">
                      <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-tokyo-night-blue"></span> Folia & Minestom</li>
                      <li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-tokyo-night-blue"></span> Velocity & BungeeCord</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <!-- Software Engineering -->
              <div class="p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl group" :class="isDark ? 'bg-black/20 border-tokyo-night-green/20 hover:border-tokyo-night-green/50' : 'bg-green-50/50 border-green-100 hover:border-green-300'">
                <div class="flex items-center gap-3 mb-4 border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
                  <div class="w-10 h-10 rounded-xl bg-tokyo-night-green/20 flex items-center justify-center text-tokyo-night-green group-hover:scale-110 transition-transform">💻</div>
                  <div class="font-bold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">Software Eng.</div>
                </div>
                <ul class="space-y-3" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                  <li class="flex flex-col gap-1">
                    <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-green"></span> Frontend</div>
                    <span class="ml-4 text-xs opacity-70">Vue.js & HTML/CSS</span>
                  </li>
                  <li class="flex flex-col gap-1">
                    <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-green"></span> Backend</div>
                    <span class="ml-4 text-xs opacity-70">Java & Python</span>
                  </li>
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-green"></span> AR Assistive Software</li>
                </ul>
              </div>

              <!-- Gaming & Community -->
              <div class="p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl group" :class="isDark ? 'bg-black/20 border-tokyo-night-yellow/20 hover:border-tokyo-night-yellow/50' : 'bg-yellow-50/50 border-yellow-100 hover:border-yellow-300'">
                <div class="flex items-center gap-3 mb-4 border-b pb-3" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
                  <div class="w-10 h-10 rounded-xl bg-tokyo-night-yellow/20 flex items-center justify-center text-tokyo-night-yellow group-hover:scale-110 transition-transform">🎮</div>
                  <div class="font-bold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">Gaming</div>
                </div>
                <ul class="space-y-3" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-yellow"></span> Minecraft Technical</li>
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-yellow"></span> FPS & Sandbox</li>
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tokyo-night-yellow"></span> Goose Goose Duck</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- 🛠️ 常用工具 & 🌐 社交频道 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- 常用工具 | Lab Tools -->
        <div class="glass-effect rounded-3xl p-8 card-hover scroll-animate scroll-animate-delay-2 flex flex-col">
          <h2 class="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4" :class="isDark ? 'border-tokyo-night-blue/30' : 'border-blue-200'">
            <span class="text-3xl">🛠️</span>
            <span class="transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">常用工具 | Lab Tools</span>
          </h2>
          
          <div class="flex flex-wrap gap-6 justify-center items-center flex-1">
            <div v-for="tool in devTools" :key="tool.name" class="flex flex-col items-center group w-20">
              <div class="w-16 h-16 rounded-2xl glass-effect flex items-center justify-center p-3 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300 border-theme shadow-lg" :class="isDark ? 'bg-[#1f2335]/50' : 'bg-white'">
                <img :src="tool.icon" :alt="tool.name" class="w-full h-full object-contain filter drop-shadow-sm" />
              </div>
              <span class="mt-3 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity text-center" :class="isDark ? 'text-white' : 'text-gray-800'">{{ tool.name }}</span>
            </div>
          </div>
        </div>

        <!-- 社交频道 | Connect -->
        <div class="glass-effect rounded-3xl p-8 card-hover scroll-animate scroll-animate-delay-3 flex flex-col">
          <h2 class="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4" :class="isDark ? 'border-tokyo-night-magenta/30' : 'border-purple-200'">
            <span class="text-3xl">🌐</span>
            <span class="transition-colors" :class="isDark ? 'text-tokyo-night-magenta' : 'text-purple-600'">社交频道 | Connect</span>
          </h2>
          
          <div class="flex flex-wrap gap-4 justify-center items-center flex-1">
            <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="hover:-translate-y-1 hover:scale-105 transition-transform">
              <img :src="social.badge" :alt="social.name" class="h-10 shadow-md rounded" />
            </a>
          </div>
        </div>
      </div>

      <!-- 📊 GitHub 数据 | Dashboard -->
      <section class="mb-12">
        <div class="glass-effect rounded-3xl p-8 card-hover scroll-animate">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-4 border-b pb-4" :class="isDark ? 'border-tokyo-night-blue/30' : 'border-blue-200'">
            <span class="text-4xl">📊</span>
            <span class="title-reveal">GitHub 数据 | Dashboard</span>
          </h2>
          
          <div class="flex flex-col items-center gap-6">
            <div class="flex flex-col lg:flex-row gap-6 w-full justify-center items-center">
              <a href="https://github.com/anuraghazra/github-readme-stats" class="hover:scale-105 transition-transform" target="_blank">
                <img height="190" alt="DaZiDian's GitHub stats" src="https://github-readme-stats-sigma-five.vercel.app/api?username=DaZiDian&count_private=true&locale=cn&theme=tokyonight&show_icons=true" class="rounded-xl shadow-lg" />
              </a>
              <a href="https://github.com/anuraghazra/github-readme-stats" class="hover:scale-105 transition-transform" target="_blank">
                <img height="190" alt="DaZiDian's top languages" src="https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=DaZiDian&count_private=true&locale=cn&layout=compact&theme=tokyonight" class="rounded-xl shadow-lg" />
              </a>
            </div>
            
            <div class="w-full flex justify-center hover:scale-[1.02] transition-transform">
              <img alt="DaZiDian's GitHub streak" src="https://streak-stats.demolab.com?user=DaZiDian&theme=tokyonight&hide_border=true&background=00000000" class="max-w-full" />
            </div>
            
            <div class="w-full flex justify-center hover:scale-[1.02] transition-transform">
              <img alt="DaZiDian's GitHub trophies" src="https://github-profile-trophy.vercel.app/?username=DaZiDian&theme=algolia&no-frame=true&no-bg=true&margin-w=8&row=1&column=6" class="max-w-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- 我的代表作品卡片 -->
      <section class="mb-12">
        <div class="glass-effect rounded-3xl p-8 card-hover scroll-animate scroll-animate-delay-2">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-4 border-b pb-4" :class="isDark ? 'border-tokyo-night-blue/30' : 'border-blue-200'">
            <span class="text-4xl">🚀</span>
            <span class="title-reveal">我的代表作品 | My Products</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a 
              v-for="project in projects" 
              :key="project.name"
              :href="project.url" 
              target="_blank"
              class="block p-6 glass-effect rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border"
              :class="isDark ? 'border-tokyo-night-blue/30 bg-[#1a1b26]/50' : 'border-blue-100 bg-white/50'"
            >
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-tokyo-night-blue to-tokyo-night-cyan flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {{ project.name[0] }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-lg mb-2 truncate transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">{{ project.name }}</h3>
                  <p class="text-sm line-clamp-2 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">{{ project.description }}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- 底部区域：最新文章 & 音乐盒 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-stretch scroll-animate scroll-animate-delay-3">
        <!-- 最新文章 -->
        <div class="glass-effect rounded-3xl p-8 flex flex-col border" :class="isDark ? 'border-tokyo-night-blue/30 bg-[#1a1b26]/50' : 'border-blue-100 bg-white/50'">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-between border-b pb-4" :class="isDark ? 'border-tokyo-night-blue/30' : 'border-blue-200'">
            <div class="flex items-center gap-3">
              <span class="text-3xl">📝</span>
              <span class="transition-colors" :class="isDark ? 'text-tokyo-night-cyan' : 'text-blue-600'">最新文章 | Recent Posts</span>
            </div>
            <router-link to="/blog" class="text-sm px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap" :class="isDark ? 'border-tokyo-night-blue/50 text-tokyo-night-cyan hover:bg-tokyo-night-blue/20' : 'border-blue-200 text-blue-600 hover:bg-blue-50'">查看全部 →</router-link>
          </h2>
          
          <div v-if="isLoadingBlog" class="flex-1 flex items-center justify-center py-10">
             <div class="animate-spin text-3xl" :class="isDark ? 'text-tokyo-night-blue' : 'text-blue-500'">↻</div>
          </div>
          <div v-else-if="recentPosts.length === 0" class="flex-1 flex flex-col items-center justify-center py-10 opacity-60">
             <span class="text-4xl mb-2">📭</span>
             <p class="transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">暂无文章</p>
          </div>
          <div v-else class="flex flex-col gap-4 flex-1">
             <router-link 
               v-for="post in recentPosts" 
               :key="post.id"
               :to="`/blog/${post.slug}`"
               class="p-4 rounded-2xl glass-effect border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group flex flex-col justify-between"
               :class="isDark ? 'border-tokyo-night-blue/20 bg-black/20 hover:border-tokyo-night-cyan/50' : 'border-gray-200 bg-white hover:border-blue-300'"
             >
               <div>
                 <h3 class="font-bold text-lg mb-2 line-clamp-1 group-hover:text-tokyo-night-cyan transition-colors" :class="isDark ? 'text-white' : 'text-gray-800'">{{ post.title }}</h3>
                 <p class="text-sm line-clamp-2 mb-3 opacity-80 transition-colors" :class="isDark ? 'text-gray-300' : 'text-gray-600'">{{ post.preview }}</p>
               </div>
               <div class="flex items-center justify-between text-xs opacity-70 transition-colors" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                 <span>📅 {{ formatDate(post.created_at || post.updated_at) }}</span>
                 <span class="font-medium group-hover:underline">阅读完整内容 →</span>
               </div>
             </router-link>
          </div>
        </div>

        <!-- 音乐盒 -->
        <div class="w-full flex justify-center flex-col">
          <div class="glass-effect rounded-3xl p-8 flex flex-col justify-center border relative overflow-hidden group h-full" :class="isDark ? 'border-tokyo-night-magenta/30 bg-[#1a1b26]/50' : 'border-purple-100 bg-white/50'">
            <div class="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" :class="isDark ? 'from-tokyo-night-magenta to-tokyo-night-purple' : 'from-purple-500 to-indigo-500'"></div>
            <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 border-b pb-4 relative z-10" :class="isDark ? 'border-tokyo-night-magenta/30' : 'border-purple-200'">
              <span class="text-3xl">🎵</span>
              <span class="transition-colors" :class="isDark ? 'text-tokyo-night-magenta' : 'text-purple-600'">音乐盒 | Music Box</span>
            </h2>
            <div class="w-full relative z-10 flex-1 flex flex-col justify-center items-center h-full min-h-[300px]">
              <SpotifyPlayer class="w-full transform transition-transform group-hover:scale-[1.01] flex-1" />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import axios from 'axios'

const { isDark } = useTheme()
useScrollAnimation()

const API_BASE = '/api'
const isLoadingBlog = ref(true)
const recentPosts = ref([])

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

const fetchRecentPosts = async () => {
  try {
    isLoadingBlog.value = true
    const response = await axios.get(`${API_BASE}/blog`)
    if (response.data.success && Array.isArray(response.data.data)) {
      recentPosts.value = response.data.data
        .filter(post => post.status === 'published')
        .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))
        .map(post => {
          let preview = '暂无预览';
          if (post.content) {
            // 获取第一行非空文本作为预览
            const lines = post.content.split('\n')
              .map(line => line.replace(/<[^>]+>/g, '').replace(/[#*`~>-]/g, '').trim())
              .filter(line => line.length > 0);
            if (lines.length > 0) {
              preview = lines[0];
            }
          }
          return { ...post, preview };
        })
        .slice(0, 3)
    }
  } catch (error) {
    console.error('获取最近文章失败:', error)
  } finally {
    isLoadingBlog.value = false
  }
}

onMounted(() => {
  fetchRecentPosts()
})

const projects = ref([
  {
    name: 'StarWave-Dark',
    description: 'A beautiful dark theme',
    url: 'https://github.com/DaZiDian/StarWave-Dark'
  },
  {
    name: 'Z1D1anSFW',
    description: 'Software Framework',
    url: 'https://github.com/DaZiDian/Z1D1anSFW/tree/master'
  },
  {
    name: 'getMinecraftPython',
    description: 'Python脚本解析Minecraft官方源',
    url: 'https://github.com/DaZiDian/getMinecraftPython'
  },
  {
    name: 'LinHexShell',
    description: 'Linux Hex Shell',
    url: 'https://github.com/DaZiDian/LinHexShell'
  },
  {
    name: 'DFC',
    description: '文档格式转换工具',
    url: 'https://github.com/DaZiDian/DFC'
  },
  {
    name: 'zh_CN_NeoForgeDocumentation',
    description: 'Neo文档中文翻译',
    url: 'https://github.com/DaZiDian/zh_CN_NeoForgeDocumentation'
  }
])

const devTools = ref([
  { name: 'Windows', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg' },
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  { name: 'Kali Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kalilinux/kalilinux-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg' },
  { name: 'IntelliJ IDEA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/intellij/intellij-original.svg' },
  { name: 'PyCharm', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pycharm/pycharm-original.svg' },
  { name: 'GoLand', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/goland/goland-original.svg' },
  { name: 'RustRover', icon: 'https://resources.jetbrains.com/storage/products/company/brand/logos/RustRover_icon.svg' },
  { name: 'Gemini', icon: 'https://api.iconify.design/logos:google-gemini.svg' }
])

const socials = ref([
  { name: 'Discord', url: 'https://discordapp.com/users/daz1d1an', badge: 'https://img.shields.io/badge/Discord-daz1d1an-%235865F2.svg?style=for-the-badge&logo=Discord&logoColor=white' },
  { name: 'Telegram', url: 'https://t.me/daz1d1an', badge: 'https://img.shields.io/badge/Telegram-daz1d1an-%230088CC.svg?style=for-the-badge&logo=Telegram&logoColor=white' },
  { name: 'QQ', url: 'http://wpa.qq.com/msgrd?v=3&uin=2489043224&site=qq&menu=yes', badge: 'https://img.shields.io/badge/QQ-2489043224-%23B92B27.svg?style=for-the-badge&logo=QQ&logoColor=white' },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/@dazidian', badge: 'https://img.shields.io/badge/Youtube-@dazidian-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white' },
  { name: 'Twitch', url: 'https://www.twitch.tv/dazidian', badge: 'https://img.shields.io/badge/Twitch-dazidian-%239146FF.svg?style=for-the-badge&logo=Twitch&logoColor=white' },
  { name: 'X', url: 'https://x.com/dazidian', badge: 'https://img.shields.io/badge/x-dazidian-%23000000.svg?style=for-the-badge&logo=x&logoColor=white' },
  { name: 'Steam', url: 'https://steamcommunity.com/id/DaZiDian', badge: 'https://img.shields.io/badge/steam-DaZiDian-%23000000.svg?style=for-the-badge&logo=steam&logoColor=white' }
])
</script>

<style scoped>
/* 艺术签名 - 根据主题动态变色 */
.dark .signature-text {
  background: linear-gradient(135deg, var(--tokyo-night-blue) 0%, var(--tokyo-night-magenta) 50%, var(--tokyo-night-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: var(--tokyo-night-blue);
  animation: gradientShift 3s ease infinite;
  background-size: 200% 200%;
}

.light .signature-text {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #2563eb;
  animation: gradientShift 3s ease infinite;
  background-size: 200% 200%;
}

/* 区段标题样式 */
.dark .section-title {
  background: linear-gradient(90deg, var(--tokyo-night-blue), var(--tokyo-night-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: var(--tokyo-night-blue);
}

.light .section-title {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #2563eb;
}

.dark .section-title-alt {
  background: linear-gradient(90deg, var(--tokyo-night-magenta), var(--tokyo-night-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: var(--tokyo-night-magenta);
}

.light .section-title-alt {
  background: linear-gradient(90deg, #7c3aed, #6d28d9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #7c3aed;
}

.dark .section-title-orange {
  background: linear-gradient(90deg, var(--tokyo-night-orange), var(--tokyo-night-yellow));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: var(--tokyo-night-orange);
}

.light .section-title-orange {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #f59e0b;
}

/* 音乐盒背景 */
.dark .music-box-bg {
  background: linear-gradient(135deg, var(--tokyo-night-magenta), var(--tokyo-night-purple));
}

.light .music-box-bg {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

/* 进度条 */
.dark .progress-bar {
  background: linear-gradient(90deg, var(--tokyo-night-blue), var(--tokyo-night-cyan));
}

.light .progress-bar {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
}

/* 边框主题 */
.dark .border-theme {
  border-color: color-mix(in srgb, var(--tokyo-night-blue) 35%, transparent);
}

.light .border-theme {
  border-color: rgba(37, 99, 235, 0.3);
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
