<script setup>
import config from '../config.js'
import { useTheme } from '../composables/useTheme.js'
import { useSystemStats } from '../composables/useSystemStats.js'
import IconBase from './IconBase.vue'

defineProps({
  crumb: { type: String, default: 'ARCHIVE' }
})

const { active, palettes, setTheme } = useTheme()
const { fps, uptime } = useSystemStats()
const homeUrl = config.site.homeUrl || '/'
const host = `${config.site.name}${config.site.suffix || ''}`
</script>

<template>
  <header class="bar">
    <div class="bar__inner">
      <div class="bar__left">
        <a class="bar__home" :href="homeUrl" title="返回主控台">
          <IconBase name="arrow-left" :size="15" />
          <span class="bar__home-txt">主控台</span>
        </a>
        <span class="bar__brand">
          <i class="bar__diam" />AURORA<b>//</b>OS
        </span>
        <span class="bar__sep">›</span>
        <span class="bar__crumb">{{ crumb }}</span>
      </div>

      <div class="bar__right">
        <span class="bar__stats">
          <span class="eq"><i /><i /><i /><i /><i /></span>
          <span class="bar__stat">FPS<b>{{ fps }}</b></span>
          <span class="bar__dot">/</span>
          <span class="bar__stat">UP<b>{{ uptime }}</b></span>
        </span>
        <span class="theme">
          <button
            v-for="(p, key) in palettes"
            :key="key"
            class="theme__sw"
            :class="{ 'is-on': active === key }"
            :style="{ '--sw': p.a }"
            :title="p.label"
            @click="setTheme(key)"
          />
        </span>
        <span class="bar__link"><i class="bar__live" />{{ host }}</span>
      </div>
    </div>
    <div class="bar__hair" />
  </header>
</template>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: 50;
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  backdrop-filter: blur(14px) saturate(150%);
  background: linear-gradient(180deg, rgba(5, 8, 18, 0.78), rgba(5, 8, 18, 0.4));
}
.bar__inner {
  width: min(1080px, 94vw);
  margin: 0 auto;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
}
.bar__hair {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--accent-a) 45%, transparent) 50%,
    transparent
  );
}

.bar__left,
.bar__right {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.bar__home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px 5px 8px;
  color: var(--accent-a);
  border: 1px solid color-mix(in srgb, var(--accent-a) 28%, transparent);
  border-radius: 7px;
  transition: background 0.3s, box-shadow 0.3s, transform 0.3s var(--ease-out);
}
.bar__home:hover {
  background: color-mix(in srgb, var(--accent-a) 12%, transparent);
  box-shadow: 0 0 16px -2px color-mix(in srgb, var(--accent-a) 55%, transparent);
  transform: translateX(-2px);
}

.bar__brand {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-soft);
}
.bar__brand b {
  color: var(--accent-b);
}
.bar__diam {
  width: 6px;
  height: 6px;
  background: var(--accent-c);
  box-shadow: 0 0 8px var(--accent-c);
  transform: rotate(45deg);
}
.bar__sep {
  opacity: 0.4;
}
.bar__crumb {
  color: var(--accent-a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 38vw;
}

.bar__stats {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.bar__stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.bar__stat b {
  color: var(--accent-a);
  font-weight: 700;
}
.bar__dot {
  opacity: 0.4;
}

.eq {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 11px;
}
.eq i {
  width: 2.4px;
  background: var(--accent-a);
  border-radius: 1px;
  animation: eq 1s ease-in-out infinite;
}
.eq i:nth-child(1) { height: 40%; animation-delay: -0.1s; }
.eq i:nth-child(2) { height: 75%; animation-delay: -0.4s; }
.eq i:nth-child(3) { height: 100%; animation-delay: -0.7s; }
.eq i:nth-child(4) { height: 60%; animation-delay: -0.2s; }
.eq i:nth-child(5) { height: 85%; animation-delay: -0.5s; }
@keyframes eq {
  50% {
    transform: scaleY(0.35);
  }
}

.theme {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.theme__sw {
  width: 13px;
  height: 13px;
  padding: 0;
  background: var(--sw);
  box-shadow: 0 0 7px var(--sw);
  outline: 1.5px solid transparent;
  outline-offset: 2px;
  opacity: 0.5;
  transform: rotate(45deg);
  border-radius: 3px;
  transition: opacity 0.25s, outline-color 0.25s, transform 0.25s var(--ease-out);
}
.theme__sw:hover {
  opacity: 0.85;
  transform: rotate(45deg) scale(1.12);
}
.theme__sw.is-on {
  opacity: 1;
  outline-color: var(--sw);
}

.bar__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--accent-a);
  text-transform: none;
  letter-spacing: 0.5px;
}
.bar__live {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-a);
  box-shadow: 0 0 8px var(--accent-a);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

@media (max-width: 760px) {
  .bar__stats,
  .bar__home-txt,
  .bar__link {
    display: none;
  }
}
@media (max-width: 460px) {
  .bar__crumb {
    max-width: 30vw;
  }
}
@media (prefers-reduced-motion: reduce) {
  .eq i,
  .bar__live {
    animation: none;
  }
}
</style>
