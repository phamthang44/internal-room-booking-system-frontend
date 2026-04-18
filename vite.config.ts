import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "node:fs";
import type { Plugin } from "vite";

function spaFallbackPlugin(): Plugin {
  return {
    name: "spa-fallback",
    writeBundle(_options: { dir?: string }) {
      const distPath = _options?.dir || "dist";
      const indexFile = path.join(distPath, "index.html");
      const file404 = path.join(distPath, "404.html");

      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, file404);
        console.log("[spa-fallback] Copied index.html to 404.html");
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@core": path.resolve(__dirname, "./src/core"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
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
        // Vite 8 + Rolldown: manualChunks must be a function (object form is invalid)
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/")
          ) {
            return "react-vendor";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query-vendor";
          }
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/zod/") ||
            id.includes("node_modules/@hookform/resolvers")
          ) {
            return "form-vendor";
          }
        },
      },
    },
  },
});
