<script setup>
import { ref } from 'vue'
import config from '../config.js'
import { useTheme } from '../composables/useTheme.js'
import BackgroundScene from './BackgroundScene.vue'
import LoadingScreen from './LoadingScreen.vue'
import TopBar from './TopBar.vue'

const props = defineProps({
  title: { type: String, default: '' },
  crumb: { type: String, default: '' },
  scanText: { type: String, default: '▚ SCANNING SECTOR…' }
})

// 主题（与主页共用 localStorage），立即应用
const { initTheme } = useTheme()
initTheme()

const host = `${config.site.name}${config.site.suffix || ''}`
document.title = props.title ? `${host} · ${props.title}` : host

// 头像作为标签页图标
const fav = document.querySelector("link[rel='icon']") || document.createElement('link')
fav.setAttribute('rel', 'icon')
fav.removeAttribute('type')
fav.setAttribute('href', config.site.avatar)
if (!fav.parentNode) document.head.appendChild(fav)

const loaded = ref(false)
const f = config.footer || {}
const year = new Date().getFullYear()
</script>

<template>
  <BackgroundScene />
  <LoadingScreen v-if="!loaded" @done="loaded = true" />

  <div class="frame" aria-hidden="true">
    <span class="frame__b frame__b--tl" />
    <span class="frame__b frame__b--tr" />
    <span class="frame__b frame__b--bl" />
    <span class="frame__b frame__b--br" />
  </div>

  <TopBar :crumb="crumb" />

  <main class="page"><slot /></main>

  <footer class="botbar">
    <div class="botbar__inner">
      <span class="botbar__seg">© {{ f.startYear }}–{{ year }} {{ f.author }}</span>
      <span class="botbar__seg botbar__scan">{{ scanText }}</span>
      <span class="botbar__seg" v-if="f.icp">
        <a :href="f.icpLink" target="_blank" rel="noopener">{{ f.icp }}</a>
      </span>
      <a class="botbar__seg botbar__home" :href="config.site.homeUrl">← 返回主控台</a>
    </div>
  </footer>

  <div class="scanlines" aria-hidden="true"><span class="scanlines__sweep" /></div>
</template>

<style scoped>
.page {
  position: relative;
  z-index: 1;
}

.frame {
  position: fixed;
  inset: 10px;
  z-index: 40;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.frame__b {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 0 solid var(--accent-a);
  filter: drop-shadow(0 0 5px color-mix(in srgb, var(--accent-a) 55%, transparent));
}
.frame__b--tl { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
.frame__b--tr { top: -1px; right: -1px; border-top-width: 2px; border-right-width: 2px; }
.frame__b--bl { bottom: -1px; left: -1px; border-bottom-width: 2px; border-left-width: 2px; }
.frame__b--br { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }

.botbar {
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(0deg, rgba(5, 8, 18, 0.5), transparent);
}
.botbar__inner {
  width: min(1080px, 92vw);
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--text-dim);
}
.botbar__scan {
  color: var(--accent-b);
  opacity: 0.8;
}
.botbar__home {
  margin-left: auto;
  color: var(--accent-a);
  transition: text-shadow 0.25s;
}
.botbar__home:hover {
  text-shadow: 0 0 10px color-mix(in srgb, var(--accent-a) 70%, transparent);
}
.botbar a:hover {
  color: var(--text-soft);
}

.scanlines {
  position: fixed;
  inset: 0;
  z-index: 55;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.018) 0 1px, transparent 1px 3px);
  overflow: hidden;
}
.scanlines__sweep {
  position: absolute;
  left: 0;
  right: 0;
  height: 28%;
  top: -28%;
  background: linear-gradient(
    180deg,
    transparent,
    color-mix(in srgb, var(--accent-a) 5%, transparent) 60%,
    color-mix(in srgb, var(--accent-a) 8%, transparent)
  );
  animation: sweepDown 8s linear infinite;
}
@keyframes sweepDown {
  to {
    transform: translateY(460%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scanlines__sweep {
    animation: none;
  }
}
</style>
