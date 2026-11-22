import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Keep the existing Vite/React setup. The build is emitted to the root
// public/ directory so Vercel can serve it through its CDN alongside Express.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
})
