import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/fukusuke-sushi-delivery/',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        menu: 'menu.html',
        contacto: 'contacto.html',
        admin: 'admin.html'
      }
    }
  }
});