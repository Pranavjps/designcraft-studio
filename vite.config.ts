import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
                    // Feature chunks
                    'crm-pages': [
                        './src/pages/Customers',
                        './src/pages/Leads',
                        './src/pages/Contacts',
                        './src/pages/Deals',
                        './src/pages/Orders',
                        './src/pages/Tasks',
                        './src/pages/Campaigns',
                        './src/pages/Documents'
                    ],
                    'core-pages': [
                        './src/pages/Dashboard',
                        './src/pages/Conversations',
                        './src/pages/Analytics',
                        './src/pages/KnowledgeBase',
                        './src/pages/Integrations',
                        './src/pages/Settings'
                    ],
                    'auth-pages': ['./src/pages/Login', './src/pages/SignUp'],
                },
            },
        },
    },
    server: {
        port: 8080,
        proxy: {
            // Proxy API requests to avoid CORS issues in development / GitHub.dev previews
            '/api': {
                target: 'https://wa-auth-8pf4.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
})
