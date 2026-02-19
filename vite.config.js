import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!/node_modules[\\/]/.test(id)) return undefined;

          if (/node_modules[\\/](framer-motion|motion)/.test(id)) {
            return "vendor-motion";
          }

          if (/node_modules[\\/](three|@react-three|ogl)/.test(id)) {
            return "vendor-three";
          }

          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@appletosolutions/reactbits": fileURLToPath(
        new URL("./src/vendor/reactbits-clickspark-shim.jsx", import.meta.url)
      ),
    },
  },
});
