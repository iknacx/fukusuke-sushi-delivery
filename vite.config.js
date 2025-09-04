import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/fukusuke-sushi-delivery/', // base para GitHub Pages
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        menu: 'src/menu/index.html',
        contacto: 'src/contacto/index.html',
      }
    }
  }
});