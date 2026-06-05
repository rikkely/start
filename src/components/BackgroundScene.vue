<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import config from '../config.js'
import { bundledBackgrounds } from '../assets/media.js'
import { usePointer } from '../composables/usePointer.js'

// 内置极光渐变场景（即使没有任何图片也能漂亮运行）
const GRADIENT_SCENES = [
  'radial-gradient(120% 90% at 18% 12%, #1b3a6b 0%, transparent 55%), radial-gradient(100% 80% at 85% 20%, #6d4aa733 0%, transparent 50%), radial-gradient(120% 120% at 70% 90%, #2bd9c733 0%, transparent 55%), linear-gradient(160deg, #070b1a, #0c1430 60%, #07101e)',
  'radial-gradient(120% 100% at 15% 20%, #0e7490 0%, transparent 55%), radial-gradient(100% 90% at 85% 80%, #1e3a8a 0%, transparent 55%), radial-gradient(80% 70% at 60% 40%, #22d3ee2e 0%, transparent 60%), linear-gradient(170deg, #04121f, #06182b 60%, #030d18)'
]

const imageList = computed(() => {
  const cfg = config.background?.images
  if (Array.isArray(cfg) && cfg.length) return cfg
  if (bundledBackgrounds.length) return bundledBackgrounds
  return []
})
const useImages = computed(() => imageList.value.length > 0)
const scenes = computed(() => (useImages.value ? imageList.value : GRADIENT_SCENES))

const active = ref(0)
let timer = null

const { x, y } = usePointer()
const parallax = computed(() => ({
  transform: `scale(1.08) translate(${x.value * -12}px, ${y.value * -12}px)`
}))
const orbParallax = computed(() => ({
  transform: `translate(${x.value * 22}px, ${y.value * 22}px)`
}))

const layerStyle = (scene) =>
  useImages.value ? { backgroundImage: `url("${scene}")` } : { backgroundImage: scene }

onMounted(() => {
  const interval = config.background?.interval || 13000
  if (scenes.value.length > 1) {
    timer = setInterval(() => {
      active.value = (active.value + 1) % scenes.value.length
    }, interval)
  }
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="bg" aria-hidden="true">
    <div class="bg__parallax" :style="parallax">
      <div
        v-for="(scene, i) in scenes"
        :key="i"
        class="bg__layer"
        :class="{ 'is-active': i === active }"
        :style="layerStyle(scene)"
      />
    </div>

    <div class="bg__orbs" :style="orbParallax">
      <span class="orb orb--a" />
      <span class="orb orb--b" />
      <span class="orb orb--c" />
    </div>

    <div class="bg__vignette" />
    <div class="bg__grid" />
    <div class="bg__grain" />
  </div>
</template>

<style scoped>
.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: var(--bg-0);
}
.bg__parallax {
  position: absolute;
  inset: -4%;
  will-change: transform;
  transition: transform 0.5s var(--ease-out);
}
.bg__layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.06);
  transition: opacity 2.2s var(--ease-in-out), transform 14s linear;
  will-change: opacity, transform;
}
.bg__layer.is-active {
  opacity: 1;
  transform: scale(1);
}

.bg__orbs {
  position: absolute;
  inset: 0;
  transition: transform 0.6s var(--ease-out);
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  opacity: 0.42;
  mix-blend-mode: screen;
}
.orb--a {
  width: 42vw;
  height: 42vw;
  top: -12%;
  left: -6%;
  background: radial-gradient(circle, var(--accent-a), transparent 70%);
  animation: drift1 24s var(--ease-in-out) infinite;
}
.orb--b {
  width: 34vw;
  height: 34vw;
  bottom: -14%;
  right: -8%;
  background: radial-gradient(circle, var(--accent-c), transparent 70%);
  animation: drift2 28s var(--ease-in-out) infinite;
}
.orb--c {
  width: 26vw;
  height: 26vw;
  top: 36%;
  left: 56%;
  background: radial-gradient(circle, var(--accent-b), transparent 70%);
  animation: drift3 32s var(--ease-in-out) infinite;
}
@keyframes drift1 {
  50% {
    transform: translate(7vw, 6vh) scale(1.1);
  }
}
@keyframes drift2 {
  50% {
    transform: translate(-6vw, -5vh) scale(1.15);
  }
}
@keyframes drift3 {
  50% {
    transform: translate(-5vw, 7vh) scale(0.9);
  }
}

.bg__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 100% at 50% 22%, transparent 38%, rgba(0, 0, 0, 0.5) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.42));
}
.bg__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.026) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.026) 1px, transparent 1px);
  background-size: 46px 46px;
  -webkit-mask: radial-gradient(125% 95% at 50% 30%, #000 26%, transparent 84%);
  mask: radial-gradient(125% 95% at 50% 30%, #000 26%, transparent 84%);
}
.bg__grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .orb {
    animation: none;
  }
}
</style>
