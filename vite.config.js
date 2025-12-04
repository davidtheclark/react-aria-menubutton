import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  server: {
    open: true,
  },
  resolve: {
    alias: {
      // Ensure we can resolve the source code
      'react-aria-menubutton': path.resolve(__dirname, 'src/index.js')
    }
  },
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true
  }
});
