import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: "demo",
  server: {
    open: true,
  },
  resolve: {
    alias: {
      // Ensure we can resolve the source code
      "react-aria-menubutton": path.resolve(__dirname, "src/index.ts"),
    },
  },
  build: {
    outDir: "../demo-dist",
    emptyOutDir: true,
  },
});
