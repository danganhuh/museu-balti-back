import cors from 'cors'
import express from 'express'
import { warnIfInsecureJwtSecret } from './auth/jwt.js'
import { apiErrorHandler } from './http/asyncHandler.js'
import type { InMemoryStore } from './persistence/InMemoryStore.js'
import { authDemoRouter } from './routes/authDemo.js'
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
  app.use('/api', createMuseumRouter(store))

  setupSwagger(app)

  app.use(apiErrorHandler)

  return app
}

export function logJwtWarningsIfNeeded(): void {
  warnIfInsecureJwtSecret()
}
