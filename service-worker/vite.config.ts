import { defineConfig, ServerOptions } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    mkcert(), // Plugin mkcert pour les certificats SSL locaux
  ],
  server: {
    https: false as unknown as ServerOptions['https'],
    host: 'localhost',
    port: 5174,
  } as ServerOptions,
  build: {
    outDir: 'dist', // Dossier de sortie pour le build
    rollupOptions: {
      input: {
        main: './index.html', // Point d'entrée principal
      },
    },
  },
});
