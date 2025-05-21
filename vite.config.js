import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: 'src/index.js',
      name: 'react-virtualized-tree',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `react-virtualized-tree.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-virtualized'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-virtualized': 'ReactVirtualized',
        },
      },
    }
  }
})
