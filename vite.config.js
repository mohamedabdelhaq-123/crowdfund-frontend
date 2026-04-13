import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseURL = env.VITE_BASE_URL || 'localhost'
  const allowedHosts = (env.VITE_ALLOWED_HOSTS || baseURL)
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)
  const port = Number(env.VITE_PORT || 5173)

  return {
    plugins: [
      react(),
      {
        name: 'print-base-url',
        configureServer(server) {
          server.printUrls = () => {
            const address = server.httpServer?.address()
            const activePort =
              typeof address === 'object' && address ? address.port : port
            const url = `http://${baseURL}:${activePort}/`

            server.config.logger.info(`\n  ➜  Local:   ${url}`)
            server.config.logger.info(`  ➜  Network: ${url}\n`)
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
