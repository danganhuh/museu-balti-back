import type { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { spec } from './spec.js'

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
  app.get('/api-docs.json', (_req, res) => res.json(spec))
}
