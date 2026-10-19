import { defineConfig } from 'vite';

// base './' để chạy được trên GitHub Pages (https://<user>.github.io/4v2/)
export default defineConfig({
  base: './',
  build: { outDir: 'dist', target: 'es2020' },
});
