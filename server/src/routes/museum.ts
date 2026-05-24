import { Router } from 'express'
import { requireAuth, requirePermissions } from '../auth/middleware.js'
import { asyncHandler } from '../http/asyncHandler.js'
import { parsePagination } from '../http/pagination.js'
import type { InMemoryStore } from '../persistence/InMemoryStore.js'
import {
  parseEra,
  parseCategory,
  parseBadgeBody,
  parseExhibitBody,
  parseHallBody,
  parseHistoricalPersonBody,
  parseNonEmptyString,
  parseQuizSetBody,
  parseTimelineEventBody,
} from '../validation/dto.js'

export function createMuseumRouter(store: InMemoryStore): Router {
  const r = Router()

  // --- Halls ---
  r.get(
    '/halls',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const { limit, offset } = parsePagination(req.query as Record<string, unknown>)
      res.status(200).json(store.listHalls(offset, limit))
    }),
  )

  r.get(
    '/halls/:id',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const hall = store.getHall(req.params.id)
      if (!hall) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Hall not found' } })
        return
      }
      res.status(200).json(hall)
    }),
  )

  r.post(
    '/halls',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const hall = parseHallBody(req.body)
      store.createHall(hall)
      res.status(201).location(`/api/halls/${encodeURIComponent(hall.id)}`).json(hall)
    }),
  )

  r.put(
    '/halls/:id',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const hall = parseHallBody(req.body)
      if (hall.id !== id) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Body id must match URL id' } })
        return
      }
      store.updateHall(id, hall)
      res.status(200).json(hall)
    }),
  )

  r.delete(
    '/halls/:id',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const ok = store.deleteHall(id)
      if (!ok) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Hall not found' } })
        return
      }
      res.status(204).send()
    }),
  )

  // --- Exhibits ---
  r.get(
    '/exhibits',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const { limit, offset } = parsePagination(req.query as Record<string, unknown>)
      const q = req.query as Record<string, string | undefined>
      const filters: { hallId?: string; era?: string; category?: string } = {}
      if (typeof q.hallId === 'string' && q.hallId.trim()) filters.hallId = q.hallId.trim()
      if (typeof q.era === 'string' && q.era.trim()) filters.era = parseEra(q.era.trim(), 'era')
      if (typeof q.category === 'string' && q.category.trim()) filters.category = parseCategory(q.category.trim(), 'category')
      res.status(200).json(store.listExhibits(offset, limit, filters))
    }),
  )

  r.get(
    '/exhibits/:id',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const ex = store.getExhibit(req.params.id)
      if (!ex) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exhibit not found' } })
        return
      }
      res.status(200).json(ex)
    }),
  )

  r.post(
    '/exhibits',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const ex = parseExhibitBody(req.body)
      store.createExhibit(ex)
      res.status(201).location(`/api/exhibits/${encodeURIComponent(ex.id)}`).json(ex)
    }),
  )

  r.put(
    '/exhibits/:id',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const ex = parseExhibitBody(req.body)
      if (ex.id !== id) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Body id must match URL id' } })
        return
      }
      store.updateExhibit(id, ex)
      res.status(200).json(ex)
    }),
  )

  r.delete(
    '/exhibits/:id',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const ok = store.deleteExhibit(id)
      if (!ok) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exhibit not found' } })
        return
      }
      res.status(204).send()
    }),
  )

  // --- Historical people ---
  r.get(
    '/historical-people',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const { limit, offset } = parsePagination(req.query as Record<string, unknown>)
      res.status(200).json(store.listPeople(offset, limit))
    }),
  )

  r.get(
    '/historical-people/:id',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const p = store.getPerson(req.params.id)
      if (!p) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Person not found' } })
        return
      }
      res.status(200).json(p)
    }),
  )

  r.post(
    '/historical-people',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const p = parseHistoricalPersonBody(req.body)
      store.createPerson(p)
      res.status(201).location(`/api/historical-people/${encodeURIComponent(p.id)}`).json(p)
    }),
  )

  r.put(
    '/historical-people/:id',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const p = parseHistoricalPersonBody(req.body)
      if (p.id !== id) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Body id must match URL id' } })
        return
      }
      store.updatePerson(id, p)
      res.status(200).json(p)
    }),
  )

  r.delete(
    '/historical-people/:id',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const ok = store.deletePerson(id)
      if (!ok) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Person not found' } })
        return
      }
      res.status(204).send()
    }),
  )

  // --- Timeline events ---
  r.get(
    '/timeline-events',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const { limit, offset } = parsePagination(req.query as Record<string, unknown>)
      res.status(200).json(store.listTimelineEvents(offset, limit))
    }),
  )

  r.get(
    '/timeline-events/:id',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const t = store.getTimelineEvent(req.params.id)
      if (!t) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Timeline event not found' } })
        return
      }
      res.status(200).json(t)
    }),
  )

  r.post(
    '/timeline-events',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const t = parseTimelineEventBody(req.body)
      store.createTimelineEvent(t)
      res.status(201).location(`/api/timeline-events/${encodeURIComponent(t.id)}`).json(t)
    }),
  )

  r.put(
    '/timeline-events/:id',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const t = parseTimelineEventBody(req.body)
      if (t.id !== id) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Body id must match URL id' } })
        return
      }
      store.updateTimelineEvent(id, t)
      res.status(200).json(t)
    }),
  )

  r.delete(
    '/timeline-events/:id',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const ok = store.deleteTimelineEvent(id)
      if (!ok) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Timeline event not found' } })
        return
      }
      res.status(204).send()
    }),
  )

  // --- Quiz sets ---
  r.get(
    '/quiz-sets',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const { limit, offset } = parsePagination(req.query as Record<string, unknown>)
      res.status(200).json(store.listQuizSets(offset, limit))
    }),
  )

  r.get(
    '/quiz-sets/:id',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const q = store.getQuizSet(req.params.id)
      if (!q) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'QuizSet not found' } })
        return
      }
      res.status(200).json(q)
    }),
  )

  r.post(
    '/quiz-sets',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const q = parseQuizSetBody(req.body)
      store.createQuizSet(q)
      res.status(201).location(`/api/quiz-sets/${encodeURIComponent(q.id)}`).json(q)
    }),
  )

  r.put(
    '/quiz-sets/:id',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const q = parseQuizSetBody(req.body)
      if (q.id !== id) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Body id must match URL id' } })
        return
      }
      store.updateQuizSet(id, q)
      res.status(200).json(q)
    }),
  )

  r.delete(
    '/quiz-sets/:id',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const ok = store.deleteQuizSet(id)
      if (!ok) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'QuizSet not found' } })
        return
      }
      res.status(204).send()
    }),
  )

  // --- Badge definitions ---
  r.get(
    '/badge-definitions',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const { limit, offset } = parsePagination(req.query as Record<string, unknown>)
      res.status(200).json(store.listBadges(offset, limit))
    }),
  )

  r.get(
    '/badge-definitions/:id',
    requireAuth,
    requirePermissions('READ'),
    asyncHandler(async (req, res) => {
      const b = store.getBadge(req.params.id)
      if (!b) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Badge not found' } })
        return
      }
      res.status(200).json(b)
    }),
  )

  r.post(
    '/badge-definitions',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const b = parseBadgeBody(req.body)
      store.createBadge(b)
      res.status(201).location(`/api/badge-definitions/${encodeURIComponent(b.id)}`).json(b)
    }),
  )

  r.put(
    '/badge-definitions/:id',
    requireAuth,
    requirePermissions('WRITE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const b = parseBadgeBody(req.body)
      if (b.id !== id) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Body id must match URL id' } })
        return
      }
      store.updateBadge(id, b)
      res.status(200).json(b)
    }),
  )

  r.delete(
    '/badge-definitions/:id',
    requireAuth,
    requirePermissions('DELETE'),
    asyncHandler(async (req, res) => {
      const id = parseNonEmptyString(req.params.id, 'id')
      const ok = store.deleteBadge(id)
      if (!ok) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Badge not found' } })
        return
      }
      res.status(204).send()
    }),
  )

  return r
}
