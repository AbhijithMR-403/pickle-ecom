import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Redux
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // Lucide icons (large — isolated so it's cached independently)
          'vendor-lucide': ['lucide-react'],
        },
      },
    },
  },
})
