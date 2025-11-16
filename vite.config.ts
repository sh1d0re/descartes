import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import Terminal from 'vite-plugin-terminal';

export default defineConfig({
    base: './', 
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
        Terminal({
            console: 'terminal', // Forward console logs to the terminal
            output: ['terminal', 'console'], // Also keep them in the browser console
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
