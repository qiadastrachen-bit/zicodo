/**
 * vite.config.js - Vite 配置
 * 配置 @ 别名、后端代理、开发服务器
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // 后端 API 代理（本地开发）
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
        // 不 rewrite，保持 /api 前缀
      },
      // 宠物端交互接口代理（本地开发）
      '/ziling': {
        target: 'http://localhost:3000',
        changeOrigin: true
        // 不 rewrite，保持 /ziling 前缀
      }
    }
  },

  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser'
  }
})
