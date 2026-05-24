import { Router } from 'express'
import { requireAuth, requirePermissions } from '../auth/middleware.js'
import { asyncHandler } from '../http/asyncHandler.js'
import type { InMemoryStore } from '../persistence/InMemoryStore.js'

function parseEntry(body: unknown): { pseudonym: string; score: number } {
  if (!body || typeof body !== 'object') throw Object.assign(new Error('Body required'), { statusCode: 400 })
  const b = body as Record<string, unknown>
  if (typeof b.pseudonym !== 'string' || !b.pseudonym.trim())
    throw Object.assign(new Error('"pseudonym" must be a non-empty string'), { statusCode: 400 })
  if (typeof b.score !== 'number' || !Number.isFinite(b.score) || b.score < 0)
    throw Object.assign(new Error('"score" must be a non-negative number'), { statusCode: 400 })
  return { pseudonym: b.pseudonym.trim(), score: b.score }
}

export function createLeaderboardRouter(store: InMemoryStore): Router {
  const r = Router()

  r.get(
    '/leaderboard/:key',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      res.status(200).json(store.getLeaderboard(req.params.key))
    }),
  )

  r.post(
    '/leaderboard/:key',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const { pseudonym, score } = parseEntry(req.body)
      const entry = { pseudonym, score, at: new Date().toISOString() }
      store.addLeaderboardEntry(req.params.key, entry)
      res.status(201).json(entry)
    }),
  )

  r.delete(
    '/leaderboard/:key',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      store.clearLeaderboard(req.params.key)
      res.status(204).send()
    }),
  )

  r.delete(
    '/leaderboard',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (_req, res) => {
      store.clearAllLeaderboards()
      res.status(204).send()
    }),
  )

  return r
}
