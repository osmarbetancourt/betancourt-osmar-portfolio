import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production)
  // This ensures process.env is populated for use in defineConfig
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Parse allowed hosts for the frontend preview server
  const frontendAllowedHosts = env.VITE_APP_FRONTEND_HOSTS ?
    env.VITE_APP_FRONTEND_HOSTS.split(',').map(host => host.trim()) :
    [];

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Ensure Vite listens on all network interfaces inside Docker
      port: 5173,      // Explicitly set Vite's port
      proxy: {
        // Proxy API requests from React to Django backend
        '/api': {
          // Use the environment variable for the target URL
          target: env.VITE_APP_BACKEND_URL,
          changeOrigin: true,        // Changes the origin header to the target URL
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          secure: false, // Use secure: false for HTTPS targets if you encounter SSL issues, otherwise true or omit
        },
        // Proxy media file requests from React to Django backend
        '/media': {
          // Use the environment variable for the target URL
          target: env.VITE_APP_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/media/, '/media'),
          secure: false, // Use secure: false for HTTPS targets if you encounter SSL issues, otherwise true or omit
        },
      }
    },
    // NEW: Configuration for Vite's preview server
    preview: {
      host: '0.0.0.0', // Ensure preview server listens on all interfaces
      port: 5173,      // Explicitly set preview server's port
      allowedHosts: frontendAllowedHosts, // <--- NEW: Dynamically set allowed hosts
    },
    // Ensure the build output directory is 'dist' (default for Vite)
    build: {
      outDir: 'dist',
    }
  };
});
