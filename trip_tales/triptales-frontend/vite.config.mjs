// vite.config.mjs
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // <-- backend port
        changeOrigin: true,
        secure: false
      }
    }
  },

  build: {
    chunkSizeWarningLimit: 2000, // increase limit to 2000 KB (2 MB)
  }
});
