import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  css: {
    // Ensure CSS is processed consistently
    postcss: {
      plugins: [
        // Add any PostCSS plugins if needed
      ]
    },
    // Ensure CSS modules work properly
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4173
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
}) 