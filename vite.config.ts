import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// Configurable proxy target for development
// Default: local backend
// Production: set VITE_PROXY_TARGET=https://dunepower-api.acceptable.pro
const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Handle SPA routing in dev and preview modes
  appType: 'spa',
  server: {
    proxy: {
      // Proxy API requests to backend in development (avoids CORS issues)
      // Maps /api/v1/* -> {proxyTarget}/api/v1/*
      // Local: http://localhost:8080/api/v1/*
      // Production: https://dunepower-api.acceptable.pro/api/v1/*
      '/api/v1': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log(`🔄 Proxying: ${req.method} ${req.url} → ${proxyTarget}${req.url}`)
          })
        },
      },
    },
  },
})
