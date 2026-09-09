// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true, // cho phép test trên điện thoại cùng mạng LAN
  },
  build: {
    target: "es2020", // an toàn cho Safari 14+
    sourcemap: false,
  },
});
