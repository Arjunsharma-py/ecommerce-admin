import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 👇 Important for GitHub Pages
  // base: '/ecommerce-admin/',   // replace with your repo name
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://ecommerce-api.urgentprinters.com",
        changeOrigin: true,
      },
    },
  },
});
