import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/scss/styles.scss',
                'resources/js/app.js',

                'resources/scss/auth/auth-styles.scss',

                'resources/scss/backend/styles-backend.scss',
                'resources/js/app-backend.js'
            ],
            refresh: true,
            // refresh: [
            //     // 'routes/**',
            //     // 'resources/views/**',
            //     'resources/scss/**',
            // ],
        }),
        // {
        //     name: 'blade',
        //     handleHotUpdate({ file, server }) {
        //         if (file.endsWith('.blade.php')) {
        //             server.ws.send({
        //                 type: 'full-reload',
        //                 path: '*',
        //             });
        //         }
        //     },
        // }
    ],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    let dir = '';
                    let name = assetInfo.name.split('.').at(0);
                    if (/-backend/i.test(name)) {
                        dir = 'admin/';
                    }
                    let extType = assetInfo.name.split('.').at(1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return `assets/${dir}${extType}/[name][extname]`;
                },
                chunkFileNames: (assetInfo) => {
                    let dir = '';
                    let name = assetInfo.name.split('.').at(0);
                    if (/-backend/i.test(name) || name === 'axios') {
                        dir = 'admin/';
                    }
                    return `assets/${dir}js/[name].js`;
                },
                entryFileNames: (assetInfo) => {
                    let dir = '';
                    let name = assetInfo.name.split('.').at(0);
                    if (/-backend/i.test(name) || name === 'axios') {
                        dir = 'admin/';
                    }
                    return `assets/${dir}js/[name].js`;
                },
                // assetFileNames: 'assets/[name][extname]',
                // chunkFileNames: 'assets/js/[name].js',
                // entryFileNames: 'assets/js/[name].js',
            },
        },
    }
});
