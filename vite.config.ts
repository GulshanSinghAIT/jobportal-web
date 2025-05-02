import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://jobportal-api-2nhd.onrender.com'  // 👈 Proxy /api requests to backend
    }
  }
});
