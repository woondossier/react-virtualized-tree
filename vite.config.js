import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), visualizer({
        filename: './dist/stats.html',
        template: 'treemap', // optional: 'sunburst' or 'treemap'
        gzipSize: true,
        brotliSize: true,
    })],
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
        },
        minify: false,
    }
})
