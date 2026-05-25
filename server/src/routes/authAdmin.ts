import { randomBytes } from 'node:crypto'
import { Router } from 'express'
import { requireAuth, requirePermissions } from '../auth/middleware.js'
import { asyncHandler } from '../http/asyncHandler.js'
import { getJwtExpiresIn, signAccessToken } from '../auth/jwt.js'
import { roleDefaultPermissions } from '../auth/roles.js'
import type { InMemoryStore } from '../persistence/InMemoryStore.js'

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET?.trim() || 'changeme'
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL?.trim() || 'admin@example.com'
}

function issueToken(sub: string, role: 'ADMIN' | 'WRITER') {
  const permissions = [...roleDefaultPermissions[role]]
  const accessToken = signAccessToken({ sub, role, permissions })
  return { accessToken, tokenType: 'Bearer', expiresIn: getJwtExpiresIn(), role, permissions }
}

export function createAuthAdminRouter(store: InMemoryStore): Router {
  const r = Router()

  // POST /auth/admin-login — verifies ADMIN_SECRET, returns ADMIN JWT
  r.post(
    '/auth/admin-login',
    asyncHandler(async (req, res) => {
      const body = req.body as Record<string, unknown>
      if (typeof body.secret !== 'string' || body.secret !== getAdminSecret()) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid admin secret.' } })
        return
      }
      res.json(issueToken(getAdminEmail(), 'ADMIN'))
    }),
  )

  // POST /auth/redeem — exchanges a one-time invite code for a JWT
  r.post(
    '/auth/redeem',
    asyncHandler(async (req, res) => {
      const body = req.body as Record<string, unknown>
      if (typeof body.code !== 'string' || !body.code.trim()) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: '"code" is required.' } })
        return
      }
      const invite = store.redeemInvite(body.code.trim())
      if (!invite) {
        res.status(400).json({ error: { code: 'INVALID_CODE', message: 'Code is invalid, expired, or already used.' } })
        return
      }
      res.json(issueToken(`invited:${invite.code}`, invite.role))
    }),
  )

  // POST /api/admin/invites — generate an invite code (ADMIN only)
  r.post(
    '/api/admin/invites',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const body = req.body as Record<string, unknown>
      const role = body.role === 'WRITER' || body.role === 'ADMIN' ? body.role : null
      if (!role) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: '"role" must be WRITER or ADMIN.' } })
        return
      }
      const code = 'INV-' + randomBytes(4).toString('hex').toUpperCase()
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
      store.createInvite({ code, role, createdAt: now.toISOString(), expiresAt })
      res.status(201).json({ code, role, expiresAt })
    }),
  )

  // GET /api/admin/invites — list unused invites (ADMIN only)
  r.get(
    '/api/admin/invites',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (_req, res) => {
      res.json(store.listInvites())
    }),
  )

  // DELETE /api/admin/invites/:code — revoke an invite (ADMIN only)
  r.delete(
    '/api/admin/invites/:code',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const ok = store.revokeInvite(req.params.code)
      if (!ok) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invite not found.' } })
        return
      }
      res.status(204).send()
    }),
  )

  return r
}
