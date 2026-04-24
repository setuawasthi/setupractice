import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'convex-vendor': ['convex', 'convex/react'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: 5174,
    strictPort: true,
  },
})