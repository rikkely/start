<script setup>
defineProps({
  active: { type: String, required: true }
})

const CABINS = [
  { id: 'home', label: '主控台', url: '/' },
  { id: 'blog', label: '博客', url: '/blog/' },
  { id: 'pan', label: '网盘', url: '/pan/' },
  { id: 'music', label: '音乐', url: '/music/' },
  { id: 'start', label: '起始页', url: '/start/' },
  { id: 'nav', label: '网址集', url: '/nav/' },
  { id: 'lab', label: '实验室', url: '/lab/' }
]
</script>

<template>
  <nav class="adock" aria-label="Aurora 空间导航">
    <div class="adock__bar">
      <a
        v-for="c in CABINS"
        :key="c.id"
        class="adock__item"
        :class="{ 'is-on': c.id === active }"
        :href="c.url"
      >
        <span class="adock__dot" aria-hidden="true" />
        <span>{{ c.label }}</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.adock {
  position: fixed;
  left: 50%;
  bottom: max(16px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 80;
  max-width: 94vw;
}
.adock__bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(10, 17, 33, 0.78);
  border: 1px solid rgba(143, 208, 255, 0.22);
  box-shadow: 0 18px 44px -14px rgba(0, 0, 0, 0.85),
    inset 0 1px 0 rgba(233, 240, 252, 0.14);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  overflow-x: auto;
  scrollbar-width: none;
}
.adock__bar::-webkit-scrollbar {
  display: none;
}
.adock__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 500;
  white-space: nowrap;
  color: var(--text-soft);
  transition: color 0.25s, background 0.25s;
}
.adock__item:hover {
  color: var(--text);
  background: rgba(143, 208, 255, 0.14);
}
.adock__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.4;
}
.adock__item.is-on {
  color: #07101e;
  background: linear-gradient(120deg, var(--accent-a), var(--accent-b));
  font-weight: 700;
  box-shadow: 0 0 18px -4px rgba(143, 208, 255, 0.7);
}
.adock__item.is-on .adock__dot {
  opacity: 0.9;
}
</style>
