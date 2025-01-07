import { defineConfig, UserConfig } from 'vite';

export default defineConfig({
    // Configuration options
    build: {
        outDir: 'build',
    },
    server: {
        port: 3000,
    },
    assetsInclude: [ "*.mp3" ],
});