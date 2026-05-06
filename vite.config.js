import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const BACKEND_URL = env.VITE_BE_API_BASE_URL || 'http://localhost:8082'

    return {
        plugins: [vue(), ui()],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src')
            }
        },
        server: {
            proxy: {
                '/opsvision': {
                    target: BACKEND_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/opsvision/, '')
                }
            }
        }
    }
})
