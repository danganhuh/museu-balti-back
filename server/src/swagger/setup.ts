import type { Express, NextFunction, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { spec } from './spec.js'

function getServerUrl(req: Request): string {
  // Render (and most proxies) set X-Forwarded-Proto; fall back to req.protocol for local dev
  const proto = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0].trim() ?? req.protocol
  return `${proto}://${req.get('host')}`
}

export function setupSwagger(app: Express): void {
  // Serve Swagger UI with the servers array resolved to the actual request host.
  // This fixes "Failed to fetch" when the spec hardcodes localhost.
  app.use('/api-docs', swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
    const dynamicSpec = { ...spec, servers: [{ url: getServerUrl(req), description: 'This server' }] }
    swaggerUi.setup(dynamicSpec)(req, res, next)
  })

  app.get('/api-docs.json', (req, res) => {
    res.json({ ...spec, servers: [{ url: getServerUrl(req), description: 'This server' }] })
  })

  // Short alias — easy to type
  app.get('/docs', (_req, res) => res.redirect('/api-docs'))
}
