import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'; // Import https module

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production)
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Parse allowed hosts for the frontend preview server
  const frontendAllowedHosts = env.VITE_APP_FRONTEND_HOSTS ?
    env.VITE_APP_FRONTEND_HOSTS.split(',').map(host => host.trim()) :
    [];

  // Conditionally create HTTPS agent only if the backend URL is HTTPS
  let proxyAgent = undefined; // Default to no agent
  if (env.VITE_APP_BACKEND_URL && env.VITE_APP_BACKEND_URL.startsWith('https://')) {
    proxyAgent = new https.Agent({
      rejectUnauthorized: false, // Set to false to bypass SSL certificate validation (use with caution)
    });
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Ensure Vite listens on all network interfaces inside Docker
      port: 5173,      // Explicitly set Vite's port
      proxy: {
        // Proxy API requests from React to Django backend
        '/api': {
          target: env.VITE_APP_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          secure: false, // Keep this false, as the agent (if used) will handle SSL
          agent: proxyAgent, // <--- MODIFIED: Conditionally use the custom HTTPS agent
        },
        // Proxy media file requests from React to Django backend
        '/media': {
          target: env.VITE_APP_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/media/, '/media'),
          secure: false, // Keep this false
          agent: proxyAgent, // <--- MODIFIED: Conditionally use the custom HTTPS agent
        },
      }
    },
    // Configuration for Vite's preview server
    preview: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: frontendAllowedHosts,
    },
    // Ensure the build output directory is 'dist' (default for Vite)
    build: {
      outDir: 'dist',
    }
  };
});
