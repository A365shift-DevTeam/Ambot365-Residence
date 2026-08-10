import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 5179,
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    cssMinify: true,
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion', 'gsap', 'lenis'],
          'icons': ['lucide-react', 'react-icons'],
        },
      },
    },
  },
});