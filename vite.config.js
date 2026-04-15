import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseURL = env.VITE_BASE_URL || 'localhost'
  const allowedHosts = (env.VITE_ALLOWED_HOSTS || 'localhost')
    .split(',')
    .map((host: string) => host.trim())
    .filter(Boolean)
  const port = Number(env.VITE_PORT || 5173)

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'print-base-url',
        configureServer(server: any) {
          server.printUrls = () => {
            server.config.logger.info(`\n  🚀 Launch:   ${baseURL}`)
            server.config.logger.info('')
          }
        },
      },
    ],
    server: {
      host: '0.0.0.0',
      port,
      allowedHosts,
    },
  }
})