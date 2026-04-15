import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseURL = env.VITE_BASE_URL || 'localhost'
  const allowedHosts = (env.VITE_ALLOWED_HOSTS || 'localhost')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  return {
    plugins: [
      react(),
      {
        name: 'print-base-url',
        configureServer(server) {
          server.printUrls = () => {
            server.config.logger.info(`\n  🚀 Launch:   ${baseURL}`)
            server.config.logger.info('')
          }
        },
      },
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts,
    },
  }
})
