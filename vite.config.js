import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
    plugins: [preact()],
    root: 'src/renderer',
    base: './',
    build: {
        outDir: '../../dist/renderer',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'src/renderer/index.html'
            }
        }
    },
    server: {
        port: 5173,
        strictPort: true
    }
});
