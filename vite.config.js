import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/fukusuke-sushi-delivery/', // base para GitHub Pages
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist'
  }
});