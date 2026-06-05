<script setup>
// 纯装饰：柔和的「黎明玻璃」背景（浅色渐变 + 漂浮柔光 + 细颗粒）
</script>

<template>
  <div class="zen" aria-hidden="true">
    <span class="zen__blob zen__blob--a" />
    <span class="zen__blob zen__blob--b" />
    <span class="zen__blob zen__blob--c" />
    <div class="zen__grain" />
  </div>
</template>

<style scoped>
.zen {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(155deg, #eaf1ff 0%, #f3ecff 38%, #ffeef6 68%, #e9fbf4 100%);
}
.zen__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  opacity: 0.55;
  mix-blend-mode: multiply;
}
.zen__blob--a {
  width: 46vw;
  height: 46vw;
  top: -10%;
  left: -8%;
  background: radial-gradient(circle, #b9c6ff, transparent 70%);
  animation: float1 26s ease-in-out infinite;
}
.zen__blob--b {
  width: 40vw;
  height: 40vw;
  bottom: -12%;
  right: -8%;
  background: radial-gradient(circle, #ffc7e3, transparent 70%);
  animation: float2 30s ease-in-out infinite;
}
.zen__blob--c {
  width: 34vw;
  height: 34vw;
  top: 38%;
  left: 52%;
  background: radial-gradient(circle, #b7f0dd, transparent 70%);
  animation: float3 34s ease-in-out infinite;
}
@keyframes float1 { 50% { transform: translate(6vw, 5vh) scale(1.1); } }
@keyframes float2 { 50% { transform: translate(-5vw, -4vh) scale(1.12); } }
@keyframes float3 { 50% { transform: translate(-4vw, 6vh) scale(0.92); } }

.zen__grain {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .zen__blob {
    animation: none;
  }
}
</style>
