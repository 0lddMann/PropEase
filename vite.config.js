import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        injectOptions: {
          tags: [
            {
              tag: 'link',
              attrs: {
                rel: 'stylesheet',
                href: '/src/css/styles.css',
              },
            },
            {
              tag: 'script',
              attrs: {
                src: '/src/js/script.js',
              },
            },
            {
              tag: 'script',
              attrs: {
                src: '/src/js/animations.js',
              },
            },
            {
              tag: 'script',
              attrs: {
                src: '/src/js/auth.js',
              },
            },
          ],
        },
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});