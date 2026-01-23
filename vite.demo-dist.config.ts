import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite config for running the demo against the built library (dist/).
 * This tests what users actually get when they install the package.
 *
 * Usage: npm run start:dist
 *
 * Note: You must run `npm run build` first to generate the dist/ files.
 */
export default defineConfig({
  plugins: [react()],
  root: "demo",
  server: {
    open: true,
  },
  resolve: {
    alias: {
      // Use the built library instead of source
      "react-aria-menubutton": path.resolve(
        __dirname,
        "dist/react-aria-menubutton.es.js"
      ),
    },
  },
  build: {
    outDir: "../demo-dist",
    emptyOutDir: true,
  },
});
