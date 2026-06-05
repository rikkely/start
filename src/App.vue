<script setup>
import config from './config.js'
import ZenStage from './components/ZenStage.vue'
import StartBay from './components/StartBay.vue'
import IconBase from './components/IconBase.vue'

// 固定「禅意浅色玻璃」配色（独立风格，浅底深字）
const s = document.documentElement.style
s.setProperty('--bg-0', '#eef2fb')
s.setProperty('--text', '#2a2f4a')
s.setProperty('--text-soft', 'rgba(42, 47, 74, 0.7)')
s.setProperty('--text-dim', 'rgba(42, 47, 74, 0.45)')
s.setProperty('--accent-a', '#6d7bff')
s.setProperty('--accent-b', '#1bb6c9')
s.setProperty('--accent-c', '#ff7eb6')

const host = `${config.site.name}${config.site.suffix || ''}`
document.title = `${host} · 启航舱`

const fav = document.querySelector("link[rel='icon']") || document.createElement('link')
fav.setAttribute('rel', 'icon')
fav.removeAttribute('type')
fav.setAttribute('href', config.site.avatar)
if (!fav.parentNode) document.head.appendChild(fav)
</script>

<template>
  <ZenStage />

  <header class="bar">
    <a class="bar__home" :href="config.site.homeUrl"><IconBase name="arrow-left" :size="15" /><span>主控台</span></a>
    <span class="bar__brand">{{ host }}<i>·</i>LAUNCH BAY</span>
  </header>

  <main class="page"><StartBay /></main>
</template>

<style scoped>
.bar {
  width: min(960px, 92vw);
  margin: 0 auto;
  padding: 22px 4px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bar__home {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px 8px 11px;
  font-size: 0.82rem;
  color: var(--text-soft);
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  box-shadow: 0 6px 20px -10px rgba(60, 70, 120, 0.4);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s, color 0.25s;
}
.bar__home:hover {
  transform: translateX(-2px);
  color: var(--accent-a);
  box-shadow: 0 10px 26px -10px rgba(80, 90, 160, 0.5);
}
.bar__brand {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-dim);
}
.bar__brand i {
  margin: 0 6px;
  color: var(--accent-a);
  font-style: normal;
}
.page {
  position: relative;
  z-index: 1;
}
</style>
