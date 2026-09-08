<script setup>
// 「深空舷窗」背景：极夜星空 + 极光绸带 + 偶尔划过的流星。
// 纯 CSS、零图片。星星由序号伪随机布点，布局每次刷新一致。
function starStyle(n, layer) {
  const seed = (n * 9301 + 49297 + layer * 777) % 233280
  const r = seed / 233280
  const size = layer === 1 ? 1 : 1 + Math.round(r * 1.6)
  return {
    left: ((n * 131 + layer * 47) % 100) + '%',
    top: ((n * 73 + layer * 29) % 92) + '%',
    width: size + 'px',
    height: size + 'px',
    opacity: 0.25 + r * 0.6,
    animationDuration: 2.4 + (n % 5) * 1.1 + 's',
    animationDelay: -(n * 0.7) + 's'
  }
}
</script>

<template>
  <div class="space" aria-hidden="true">
    <!-- 两层星野（近层稍大、闪烁更明显） -->
    <div class="space__stars space__stars--far">
      <span v-for="n in 44" :key="'f' + n" :style="starStyle(n, 1)" />
    </div>
    <div class="space__stars space__stars--near">
      <span v-for="n in 26" :key="'n' + n" :style="starStyle(n, 2)" />
    </div>

    <!-- 极光绸带 -->
    <div class="space__aurora space__aurora--a" />
    <div class="space__aurora space__aurora--b" />

    <!-- 地平线辉光 -->
    <div class="space__horizon" />

    <!-- 流星 -->
    <span class="space__meteor" />

    <div class="space__vignette" />
  </div>
</template>

<style scoped>
.space {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(180deg, #030509 0%, #060b18 45%, #0a1426 100%);
}

/* ---------- 星野 ---------- */
.space__stars {
  position: absolute;
  inset: 0;
}
.space__stars span {
  position: absolute;
  border-radius: 50%;
  background: #dcebff;
  animation: twinkle ease-in-out infinite;
}
.space__stars--near span {
  box-shadow: 0 0 6px 1px rgba(173, 216, 255, 0.55);
}
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.9;
  }
}

/* ---------- 极光绸带 ---------- */
.space__aurora {
  position: absolute;
  left: -20%;
  width: 140%;
  height: 42vh;
  filter: blur(46px);
  opacity: 0.4;
  transform: skewY(-7deg);
}
.space__aurora--a {
  top: 4%;
  background: linear-gradient(
    100deg,
    transparent 5%,
    rgba(126, 240, 192, 0.4) 30%,
    rgba(143, 208, 255, 0.32) 55%,
    rgba(184, 155, 255, 0.26) 78%,
    transparent 95%
  );
  animation: auroraSway 17s var(--ease-in-out) infinite;
}
.space__aurora--b {
  top: 20%;
  height: 30vh;
  opacity: 0.26;
  background: linear-gradient(
    95deg,
    transparent 8%,
    rgba(184, 155, 255, 0.35) 35%,
    rgba(126, 240, 192, 0.3) 70%,
    transparent 94%
  );
  animation: auroraSway 23s var(--ease-in-out) infinite reverse;
}
@keyframes auroraSway {
  0%,
  100% {
    transform: skewY(-7deg) translateX(0) scaleY(1);
  }
  50% {
    transform: skewY(-5deg) translateX(4%) scaleY(1.18);
  }
}

/* ---------- 地平线辉光 ---------- */
.space__horizon {
  position: absolute;
  bottom: -30vh;
  left: 50%;
  width: 130vw;
  height: 50vh;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse at center,
    rgba(126, 240, 192, 0.16) 0%,
    rgba(143, 208, 255, 0.1) 38%,
    transparent 68%
  );
  filter: blur(24px);
}

/* ---------- 流星：长间隔循环划过 ---------- */
.space__meteor {
  position: absolute;
  top: 14%;
  left: -12%;
  width: 130px;
  height: 1.5px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgba(220, 235, 255, 0.9));
  box-shadow: 0 0 10px rgba(173, 216, 255, 0.7);
  transform: rotate(16deg);
  opacity: 0;
  animation: meteor 9s linear infinite;
  animation-delay: 3s;
}
@keyframes meteor {
  0%,
  88% {
    opacity: 0;
    transform: rotate(16deg) translateX(0);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(16deg) translateX(130vw);
  }
}

.space__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 95% at 50% 35%, transparent 50%, rgba(0, 0, 0, 0.45) 100%);
}

/* 移动端降负载：少一半星星、极光模糊减半 */
@media (max-width: 640px) {
  .space__stars--far span:nth-child(odd) {
    display: none;
  }
  .space__aurora {
    filter: blur(26px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .space__stars span,
  .space__aurora,
  .space__meteor {
    animation: none;
  }
}
</style>
