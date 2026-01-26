import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types',
      include: ['src/**/*'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*', 'src/test/**/*'],
    }),
    visualizer({
      filename: './dist/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'react-virtualized-tree',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `react-virtualized-tree.${format}.js`,
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
    },
    minify: true,
  },
});
