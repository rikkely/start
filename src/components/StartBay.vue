<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import config from '../config.js'
import IconBase from './IconBase.vue'

const bay = config.bay || {}
const engines = config.engines || []
const tiles = config.tiles || []

const now = ref(new Date())
let timer = null

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
const inputRef = ref(null)
const engine = computed(() => engines[engineIdx.value] || {})

const isDirectUrl = computed(() => {
  const s = q.value.trim()
  if (!s || /\s/.test(s)) return false
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(s)
})

function submit() {
  const term = q.value.trim()
  if (!term) return
  if (isDirectUrl.value) {
    const url = /^https?:\/\//i.test(term) ? term : `https://${term}`
    window.open(url, '_blank', 'noopener')
    return
  }
  if (!engine.value.url?.includes('{q}')) return
  window.open(engine.value.url.replace('{q}', encodeURIComponent(term)), '_blank', 'noopener')
}

function cycleEngine() {
  if (!engines.length) return
  engineIdx.value = (engineIdx.value + 1) % engines.length
}

function onGlobalKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    inputRef.value?.focus()
    return
  }
  if (e.key === '/' && document.activeElement !== inputRef.value) {
    const tag = e.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    e.preventDefault()
    inputRef.value?.focus()
  }
}

function onInputKeydown(e) {
  if (e.key === 'Tab' && engines.length > 1) {
    e.preventDefault()
    cycleEngine()
  } else if (e.key === 'Escape') {
    q.value = ''
    inputRef.value?.blur()
  }
}

onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 1000)
  window.addEventListener('keydown', onGlobalKey)
})
onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('keydown', onGlobalKey)
})

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
        <input
          ref="inputRef"
          v-model="q"
          type="text"
          :placeholder="`在 ${engine.name} 中搜索，或输入网址… (按 / 聚焦 · Tab 切引擎)`"
          spellcheck="false"
          @keydown="onInputKeydown"
        />
        <span v-if="isDirectUrl" class="finder__direct">直达 ↵</span>
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

    <!-- 快捷入口（4×2 均衡矩阵） -->
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
          :style="{ '--delay': i * 0.045 + 's' }"
        >
          <span class="tile__icon"><IconBase :name="t.icon" :size="21" /></span>
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
  padding: clamp(28px, 6.5vh, 72px) 0 36px;
}

/* clock —— 舷窗外的极光下，一块发光的钟 */
.clock {
  text-align: center;
  margin-bottom: 38px;
}
.clock__hi {
  font-size: 1.02rem;
  letter-spacing: 1px;
  color: var(--text-soft);
}
.clock__time {
  display: inline-flex;
  align-items: baseline;
  margin: 10px 0 12px;
  font-size: clamp(3.6rem, 12vw, 6.6rem);
  font-weight: 100;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--text);
  letter-spacing: -1px;
  text-shadow: 0 0 36px rgba(143, 208, 255, 0.42), 0 0 84px rgba(126, 240, 192, 0.16);
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
  max-width: 640px;
  margin: 0 auto 48px;
}
.finder__box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: var(--text-dim);
  background: rgba(10, 17, 33, 0.62);
  border: 1px solid rgba(143, 208, 255, 0.2);
  border-radius: 18px;
  box-shadow: 0 18px 44px -20px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(233, 240, 252, 0.12);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  backdrop-filter: blur(16px) saturate(150%);
  transition: box-shadow 0.3s, transform 0.3s var(--ease-out), border-color 0.3s;
}
.finder__box:focus-within {
  transform: translateY(-2px);
  border-color: rgba(143, 208, 255, 0.55);
  box-shadow: 0 24px 54px -20px rgba(0, 0, 0, 0.9), 0 0 32px -6px rgba(143, 208, 255, 0.38);
  color: var(--accent-a);
}
.finder__box input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  color: var(--text);
  font-size: 1rem;
}
.finder__box input::placeholder {
  color: var(--text-dim);
  font-size: 0.9rem;
}
.finder__direct {
  padding: 3px 8px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--accent-b);
  background: rgba(126, 240, 192, 0.12);
  border: 1px solid rgba(126, 240, 192, 0.3);
  white-space: nowrap;
}
.finder__go {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
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
  margin-top: 15px;
}
.eng {
  padding: 6px 14px;
  font-size: 0.72rem;
  letter-spacing: 0.5px;
  color: var(--text-soft);
  background: rgba(12, 20, 38, 0.54);
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

/* launch —— 4×2 均衡深色玻璃磁贴 */
.launch__head {
  margin-bottom: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--text-soft);
  text-align: center;
}
.tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 20px 14px;
  text-align: center;
  background: rgba(11, 18, 35, 0.56);
  border: 1px solid rgba(233, 240, 252, 0.09);
  border-radius: 18px;
  box-shadow: 0 14px 36px -22px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(233, 240, 252, 0.1);
  -webkit-backdrop-filter: blur(14px) saturate(145%);
  backdrop-filter: blur(14px) saturate(145%);
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s, background 0.3s,
    border-color 0.3s;
  animation: rise 0.7s var(--ease-out) backwards;
  animation-delay: var(--delay);
}
.tile:hover {
  transform: translateY(-5px);
  background: rgba(16, 26, 48, 0.72);
  border-color: rgba(143, 208, 255, 0.42);
  box-shadow: 0 24px 50px -24px rgba(0, 0, 0, 0.9), 0 0 28px -8px rgba(143, 208, 255, 0.32);
}
.tile__icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  color: #07101e;
  background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
  box-shadow: 0 0 22px -6px rgba(143, 208, 255, 0.55);
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.tile:hover .tile__icon {
  transform: scale(1.07) rotate(-3deg);
  box-shadow: 0 0 30px -6px rgba(126, 240, 192, 0.7);
}
.tile__name {
  font-size: 0.96rem;
  font-weight: 600;
  color: var(--text);
}
.tile__desc {
  font-family: var(--font-mono);
  font-size: 0.56rem;
  letter-spacing: 1.4px;
  color: var(--text-dim);
}

@media (max-width: 760px) {
  .tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .clock__c {
    animation: none;
  }
}
</style>
