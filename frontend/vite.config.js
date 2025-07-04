import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Ensure Vite listens on all network interfaces inside Docker
    port: 5173,      // Explicitly set Vite's port
    proxy: {
      // Proxy API requests from React to Django backend
      '/api': {
        target: 'http://web:8000', // 'web' is the service name in docker-compose.yml
        changeOrigin: true,        // Changes the origin header to the target URL
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Rewrites /api to /api (optional, but good for clarity)
      },
      // NEW: Proxy media file requests from React to Django backend
      '/media': {
        target: 'http://web:8000', // 'web' is the service name in docker-compose.yml
        changeOrigin: true,        // Changes the origin header to the target URL
        rewrite: (path) => path.replace(/^\/media/, '/media'), // Rewrites /media to /media
      },
    }
  }
})
