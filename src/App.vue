<script setup>
import config from './config.js'
import ZenStage from './components/ZenStage.vue'
import StartBay from './components/StartBay.vue'
import IconBase from './components/IconBase.vue'

// 「深空舷窗」配色：极夜深蓝底 + 冰蓝 / 极光绿 / 星紫
const s = document.documentElement.style
s.setProperty('--bg-0', '#05080f')
s.setProperty('--text', '#e9f0fc')
s.setProperty('--text-soft', 'rgba(233, 240, 252, 0.72)')
s.setProperty('--text-dim', 'rgba(233, 240, 252, 0.42)')
s.setProperty('--accent-a', '#8fd0ff')
s.setProperty('--accent-b', '#7ef0c0')
s.setProperty('--accent-c', '#b89bff')

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
  background: rgba(11, 18, 35, 0.55);
  border: 1px solid rgba(143, 208, 255, 0.18);
  border-radius: 999px;
  box-shadow: 0 6px 20px -10px rgba(0, 0, 0, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s, color 0.25s,
    border-color 0.25s;
}
.bar__home:hover {
  transform: translateX(-2px);
  color: var(--accent-a);
  border-color: rgba(143, 208, 255, 0.45);
  box-shadow: 0 10px 26px -10px rgba(0, 0, 0, 0.8), 0 0 18px -6px rgba(143, 208, 255, 0.4);
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
