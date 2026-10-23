import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
    },
  },
  build: {
    emptyOutDir: true,
    outDir: ".static-render",
    ssr: "scripts/export-pages.tsx",
    rollupOptions: {
      output: {
        entryFileNames: "export-pages.mjs",
      },
    },
  },
});
