import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import compression from 'vite-plugin-compression';
import path from 'path';
// import { visualizer } from 'rollup-plugin-visualizer';  

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'brotliCompress', // Brotli 
      ext: '.br',                 
      threshold: 10240,
      compressionOptions: { level: 11 },
    }),
    // visualizer({
    //   open: true, // Abre automáticamente en el navegador
    //   filename: 'bundle-analysis.html', // Archivo de análisis generado
    //   gzipSize: true, // Mostrar el tamaño gzip también
    //   brotliSize: true, // Mostrar el tamaño brotli también
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
      'react-pdf': 'react-pdf/dist/esm/entry.webpack',
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
