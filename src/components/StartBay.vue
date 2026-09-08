<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import config from '../config.js'
import IconBase from './IconBase.vue'

const bay = config.bay || {}
const engines = config.engines || []
const tiles = config.tiles || []

const now = ref(new Date())
let timer = null
onMounted(() => (timer = setInterval(() => (now.value = new Date()), 1000)))
onUnmounted(() => clearInterval(timer))

const pad = (n) => String(n).padStart(2, '0')
const hh = computed(() => pad(now.value.getHours()))
const mm = computed(() => pad(now.value.getMinutes()))
const ss = computed(() => pad(now.value.getSeconds()))
const dateStr = computed(() => {
  const d = now.value
  const wd = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${wd}`
})
const greeting = computed(() => {
  const h = now.value.getHours()
  if (h < 5) return '夜深了'
  if (h < 8) return '早安'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  if (h < 22) return '晚上好'
  return '夜深了'
})

const engineIdx = ref(0)
try {
  const saved = localStorage.getItem('aurora:start:engine')
  const index = engines.findIndex((item) => item.key === saved)
  if (index >= 0) engineIdx.value = index
} catch {
  // 存储不可用时保留默认搜索引擎。
}
watch(engineIdx, (index) => {
  try {
    localStorage.setItem('aurora:start:engine', engines[index].key)
  } catch {
    // 保存偏好失败不影响搜索。
  }
})
const q = ref('')
const engine = computed(() => engines[engineIdx.value] || {})
function submit() {
  const term = q.value.trim()
  if (!term || !engine.value.url?.includes('{q}')) return
  window.open(engine.value.url.replace('{q}', encodeURIComponent(term)), '_blank', 'noopener')
}
const isExternal = (url) => {
  try {
    return new URL(url, location.href).origin !== location.origin
  } catch {
    return false
  }
}
</script>

<template>
  <div class="bay">
    <!-- 时钟 + 问候 -->
    <header class="clock">
      <p class="clock__hi">{{ greeting }}，{{ bay.callsign }}</p>
      <div class="clock__time">
        <span>{{ hh }}</span><span class="clock__c">:</span><span>{{ mm }}</span><span class="clock__c clock__c--s">:</span><span class="clock__s">{{ ss }}</span>
      </div>
      <p class="clock__date">{{ dateStr }}</p>
    </header>

    <!-- 搜索 -->
    <section class="finder">
      <form class="finder__box" @submit.prevent="submit">
        <IconBase name="search" :size="19" />
        <input v-model="q" type="text" :placeholder="`在 ${engine.name} 中搜索…`" spellcheck="false" />
        <button type="submit" class="finder__go" aria-label="搜索"><IconBase name="arrow-right" :size="17" /></button>
      </form>
      <div class="finder__engines">
        <button
          v-for="(e, i) in engines"
          :key="e.key"
          class="eng"
          :class="{ 'is-on': i === engineIdx }"
          @click="engineIdx = i"
        >{{ e.name }}</button>
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="launch">
      <h2 class="launch__head">快捷入口</h2>
      <div class="tiles">
        <a
          v-for="(t, i) in tiles"
          :key="t.name"
          class="tile"
          :href="t.url"
          :target="isExternal(t.url) ? '_blank' : '_self'"
          :rel="isExternal(t.url) ? 'noopener' : null"
          :style="{ '--delay': i * 0.05 + 's' }"
        >
          <span class="tile__icon"><IconBase :name="t.icon" :size="22" /></span>
          <span class="tile__name">{{ t.name }}</span>
          <span class="tile__desc">{{ t.desc }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bay {
  width: min(880px, 92vw);
  margin: 0 auto;
  padding: clamp(34px, 8vh, 90px) 0 70px;
}

/* clock —— 舷窗外的极光下，一块发光的钟 */
.clock {
  text-align: center;
  margin-bottom: 44px;
}
.clock__hi {
  font-size: 1.05rem;
  letter-spacing: 1px;
  color: var(--text-soft);
}
.clock__time {
  display: inline-flex;
  align-items: baseline;
  margin: 10px 0 12px;
  font-size: clamp(3.6rem, 13vw, 7rem);
  font-weight: 100;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--text);
  letter-spacing: -1px;
  text-shadow: 0 0 38px rgba(143, 208, 255, 0.45), 0 0 90px rgba(126, 240, 192, 0.18);
}
.clock__c {
  margin: 0 0.04em;
  color: var(--accent-a);
  font-weight: 100;
  animation: soft 1.4s ease-in-out infinite;
}
.clock__c--s {
  font-size: 0.5em;
  align-self: center;
}
.clock__s {
  font-size: 0.5em;
  align-self: center;
  color: var(--accent-a);
  font-weight: 300;
}
@keyframes soft {
  50% { opacity: 0.35; }
}
.clock__date {
  font-size: 0.86rem;
  letter-spacing: 0.5px;
  color: var(--text-dim);
}

/* finder —— 深色玻璃搜索条 */
.finder {
  max-width: 620px;
  margin: 0 auto 56px;
}
.finder__box {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px 18px;
  color: var(--text-dim);
  background: rgba(10, 17, 33, 0.55);
  border: 1px solid rgba(143, 208, 255, 0.18);
  border-radius: 18px;
  box-shadow: 0 18px 44px -20px rgba(0, 0, 0, 0.8);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  transition: box-shadow 0.3s, transform 0.3s var(--ease-out), border-color 0.3s;
}
.finder__box:focus-within {
  transform: translateY(-2px);
  border-color: rgba(143, 208, 255, 0.55);
  box-shadow: 0 24px 54px -20px rgba(0, 0, 0, 0.9), 0 0 32px -6px rgba(143, 208, 255, 0.4);
  color: var(--accent-a);
}
.finder__box input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  color: var(--text);
  font-size: 1.05rem;
}
.finder__box input::placeholder {
  color: var(--text-dim);
}
.finder__go {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #07101e;
  background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
  box-shadow: 0 0 22px -4px rgba(143, 208, 255, 0.65);
  transition: transform 0.2s var(--ease-out), box-shadow 0.25s;
}
.finder__go:hover {
  transform: translateX(2px) scale(1.04);
  box-shadow: 0 0 30px -4px rgba(126, 240, 192, 0.8);
}
.finder__engines {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.eng {
  padding: 6px 14px;
  font-size: 0.72rem;
  letter-spacing: 0.5px;
  color: var(--text-soft);
  background: rgba(12, 20, 38, 0.5);
  border: 1px solid rgba(143, 208, 255, 0.14);
  border-radius: 999px;
  transition: color 0.25s, transform 0.2s var(--ease-out), box-shadow 0.25s, border-color 0.25s;
}
.eng:hover {
  transform: translateY(-1px);
  border-color: rgba(143, 208, 255, 0.4);
}
.eng.is-on {
  color: #07101e;
  background: linear-gradient(120deg, var(--accent-a), var(--accent-b));
  border-color: transparent;
  box-shadow: 0 0 22px -6px rgba(143, 208, 255, 0.8);
  font-weight: 600;
}

/* launch —— 深色玻璃磁贴 */
.launch__head {
  margin-bottom: 18px;
  font-size: 0.96rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-soft);
  text-align: center;
}
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 22px 16px;
  text-align: center;
  background: rgba(11, 18, 35, 0.5);
  border: 1px solid rgba(233, 240, 252, 0.08);
  border-radius: 20px;
  box-shadow: 0 14px 36px -22px rgba(0, 0, 0, 0.8);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  backdrop-filter: blur(12px) saturate(140%);
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s, background 0.3s,
    border-color 0.3s;
  animation: rise 0.7s var(--ease-out) backwards;
  animation-delay: var(--delay);
}
.tile:hover {
  transform: translateY(-6px);
  background: rgba(16, 26, 48, 0.65);
  border-color: rgba(143, 208, 255, 0.4);
  box-shadow: 0 26px 52px -24px rgba(0, 0, 0, 0.9), 0 0 30px -8px rgba(143, 208, 255, 0.35);
}
.tile__icon {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 16px;
  color: #07101e;
  background: linear-gradient(135deg, var(--accent-a), var(--accent-c));
  box-shadow: 0 0 24px -6px rgba(143, 208, 255, 0.6);
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.tile:hover .tile__icon {
  transform: scale(1.08) rotate(-4deg);
  box-shadow: 0 0 32px -6px rgba(184, 155, 255, 0.75);
}
.tile__name {
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text);
}
.tile__desc {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 1.5px;
  color: var(--text-dim);
}

@media (prefers-reduced-motion: reduce) {
  .clock__c {
    animation: none;
  }
}
</style>
