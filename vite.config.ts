import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      threshold: 10240,
      ext: '.gz'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        },
      }
    },
    chunkSizeWarningLimit: 1000,
  }
});
