import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@core": path.resolve(__dirname, "./src/core"),
    },
  },
  server: {
    port: 5173,
    open: true,
    headers: {
      // Allow Google OAuth library's popup to communicate back
      // This fixes: "Cross-Origin-Opener-Policy policy would block the window.postMessage call"
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "form-vendor": ["react-hook-form", "zod", "@hookform/resolvers"],
        },
      },
    },
  },
});
