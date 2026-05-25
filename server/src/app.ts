import cors from 'cors'
import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { warnIfInsecureJwtSecret } from './auth/jwt.js'
import { apiErrorHandler } from './http/asyncHandler.js'
import type { InMemoryStore } from './persistence/InMemoryStore.js'
import { authDemoRouter } from './routes/authDemo.js'
import { createAuthAdminRouter } from './routes/authAdmin.js'
import { createLeaderboardRouter } from './routes/leaderboard.js'
import { createMuseumRouter } from './routes/museum.js'
import { tokenRouter } from './routes/token.js'
import { setupSwagger } from './swagger/setup.js'

export function createApp(store: InMemoryStore): express.Express {
  const app = express()

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? true }))
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'lab6-api' })
  })

  app.use(tokenRouter)
  app.use(authDemoRouter)
  app.use(createAuthAdminRouter(store))
  app.use('/api', createMuseumRouter(store))
  app.use('/api', createLeaderboardRouter(store))

  setupSwagger(app)

  // Serve the React frontend in production (combined Render deploy).
  // dist/ sits two levels above server/dist/index.js.
  if (process.env.NODE_ENV === 'production') {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const ui = join(__dirname, '..', '..', 'dist')
    if (existsSync(ui)) {
      app.use(express.static(ui))
      // SPA fallback — let React Router handle all non-API routes
      app.get('*', (_req, res) => res.sendFile(join(ui, 'index.html')))
    }
  }

  app.use(apiErrorHandler)

  return app
}

export function logJwtWarningsIfNeeded(): void {
  warnIfInsecureJwtSecret()
}
