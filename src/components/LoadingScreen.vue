<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import config from '../config.js'

const emit = defineEmits(['done'])
const host = `${config.site.name}${config.site.suffix || ''}`.toUpperCase()
const boot = config.boot || {}
const label = boot.label || 'ESTABLISHING LINK'
const sub = boot.sub || 'SUBSYSTEM'

const progress = ref(0)
const R = 30
const C = 2 * Math.PI * R
let timer = null

onMounted(() => {
  const steps = [22, 48, 70, 88, 100]
  let i = 0
  timer = setInterval(() => {
    progress.value = steps[i++]
    if (i >= steps.length) {
      clearInterval(timer)
      setTimeout(() => emit('done'), 360)
    }
  }, 150)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="load" :class="{ 'is-done': progress >= 100 }">
    <div class="load__grid" />
    <div class="load__core">
      <svg class="load__ring" viewBox="0 0 80 80">
        <circle class="load__track" cx="40" cy="40" :r="R" />
        <circle
          class="load__prog"
          cx="40"
          cy="40"
          :r="R"
          :stroke-dasharray="C"
          :stroke-dashoffset="C * (1 - progress / 100)"
        />
      </svg>
      <span class="load__pct">{{ progress }}</span>
    </div>
    <div class="load__label">{{ label }}</div>
    <div class="load__host">{{ host }} · {{ sub }}</div>
  </div>
</template>

<style scoped>
.load {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 18px;
  background: radial-gradient(130% 120% at 50% 40%, #0b1326, #06091380 55%, #04060e);
  transition: opacity 0.45s var(--ease-out);
}
.load.is-done {
  opacity: 0;
  pointer-events: none;
}
.load__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  -webkit-mask: radial-gradient(120% 100% at 50% 45%, #000 25%, transparent 80%);
  mask: radial-gradient(120% 100% at 50% 45%, #000 25%, transparent 80%);
}
.load__core {
  position: relative;
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
}
.load__ring {
  width: 96px;
  height: 96px;
  transform: rotate(-90deg);
}
.load__track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 3;
}
.load__prog {
  fill: none;
  stroke: var(--accent-a);
  stroke-width: 3;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent-a) 75%, transparent));
  transition: stroke-dashoffset 0.4s var(--ease-out);
}
.load__pct {
  position: absolute;
  font-family: var(--font-led);
  font-size: 1.5rem;
  color: var(--text);
  text-shadow: 0 0 12px color-mix(in srgb, var(--accent-b) 60%, transparent);
}
.load__label {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 4px;
  color: var(--accent-a);
  text-align: center;
  padding: 0 16px;
}
.load__host {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: var(--text-dim);
}
</style>
