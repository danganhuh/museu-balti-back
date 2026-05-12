import { Router } from 'express'
import { requireAuth, requirePermissions } from '../auth/middleware.js'

const router = Router()

/** Example protected route: valid JWT + `READ`. */
router.get('/auth/me', requireAuth, requirePermissions('READ'), (req, res) => {
  res.status(200).json({ subject: req.auth?.sub, role: req.auth?.role, permissions: req.auth?.permissions })
})

/** Example: requires `WRITE` — use a VISITOR token to get 403. */
router.post('/auth/write-check', requireAuth, requirePermissions('WRITE'), (_req, res) => {
  res.status(204).send()
})

export const authDemoRouter = router
