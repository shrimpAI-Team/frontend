// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true, // cho phép test trên điện thoại cùng mạng LAN
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/shrimp-analysis': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) {
            return '/index.html';
          }
        },
      },
    },
  },
  build: {
    target: "es2020", // an toàn cho Safari 14+
    sourcemap: false,
  },
});
