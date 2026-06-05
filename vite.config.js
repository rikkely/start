import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 相对路径 + hash/单页 → dist 可直接挂到任意子路径，nginx 无需 rewrite。
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 5177
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1500
  }
})