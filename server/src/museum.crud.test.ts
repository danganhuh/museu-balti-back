import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { signAccessToken } from './auth/jwt.js'
import type { AccessTokenClaims } from './auth/types.js'
import { createApp } from './app.js'
import type { Hall } from './domain/types.js'
import { InMemoryStore } from './persistence/InMemoryStore.js'

process.env.JWT_SECRET = 'vitest-jwt-secret'
process.env.JWT_EXPIRES_IN = '15m'

function authHeader(claims: AccessTokenClaims): { Authorization: string } {
  return { Authorization: `Bearer ${signAccessToken(claims)}` }
}

const readClaims: AccessTokenClaims = { sub: 'test', role: 'VISITOR', permissions: ['READ'] }
const writeClaims: AccessTokenClaims = { sub: 'test', role: 'WRITER', permissions: ['READ', 'WRITE'] }
const adminClaims: AccessTokenClaims = { sub: 'test', role: 'ADMIN', permissions: ['READ', 'WRITE', 'DELETE'] }

const minimalHall = {
  id: 'hall-t1',
  slug: 'test-hall',
  title: { ro: 'Ro', ru: 'Ru', en: 'En' },
  coverImage: 'https://example.com/cover.jpg',
  order: 1,
}

describe('museum CRUD and permission matrix', () => {
  let store: InMemoryStore
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    store = new InMemoryStore({ halls: [] })
    app = createApp(store)
  })

  it('returns 401 without Authorization for GET /api/halls', async () => {
    const res = await request(app).get('/api/halls')
    expect(res.status).toBe(401)
  })

  it('returns 403 when token lacks READ (empty permissions)', async () => {
    const claims: AccessTokenClaims = { sub: 'x', role: 'VISITOR', permissions: [] }
    const res = await request(app).get('/api/halls').set(authHeader(claims))
    expect(res.status).toBe(403)
  })

  it('returns 200 paginated list with READ token', async () => {
    const res = await request(app).get('/api/halls').set(authHeader(readClaims))
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ data: [], total: 0, limit: 20, offset: 0 })
  })

  it('returns 403 for POST /api/halls with READ-only token', async () => {
    const res = await request(app).post('/api/halls').set(authHeader(readClaims)).send(minimalHall)
    expect(res.status).toBe(403)
  })

  it('returns 201 for POST /api/halls with WRITE token', async () => {
    const res = await request(app).post('/api/halls').set(authHeader(writeClaims)).send(minimalHall)
    expect(res.status).toBe(201)
    expect(res.body.id).toBe('hall-t1')
  })

  it('returns 403 for DELETE with WRITE-only token', async () => {
    store.createHall(structuredClone(minimalHall as Hall))
    const res = await request(app).delete('/api/halls/hall-t1').set(authHeader(writeClaims))
    expect(res.status).toBe(403)
  })

  it('returns 204 for DELETE with DELETE permission', async () => {
    store.createHall(structuredClone(minimalHall as Hall))
    const res = await request(app).delete('/api/halls/hall-t1').set(authHeader(adminClaims))
    expect(res.status).toBe(204)
  })

  it('returns 409 on duplicate hall slug', async () => {
    store.createHall(structuredClone(minimalHall as Hall))
    const res = await request(app)
      .post('/api/halls')
      .set(authHeader(writeClaims))
      .send({ ...minimalHall, id: 'hall-t2' })
    expect(res.status).toBe(409)
  })

  it('returns 400 when exhibit hallId is unknown', async () => {
    const exhibit = {
      id: 'ex-1',
      hallId: 'missing-hall',
      slug: 'ex-slug',
      title: { ro: 'a', ru: 'a', en: 'a' },
      shortDescription: { ro: 'a', ru: 'a', en: 'a' },
      longDescription: { ro: 'a', ru: 'a', en: 'a' },
      era: 'modern',
      category: 'urbanism',
      heroImage: 'https://example.com/h.jpg',
      relatedPersonIds: [],
      relatedArtifactIds: [],
      relatedEventIds: [],
      funFacts: { ro: ['a'], ru: ['a'], en: ['a'] },
    }
    const res = await request(app).post('/api/exhibits').set(authHeader(writeClaims)).send(exhibit)
    expect(res.status).toBe(400)
  })
})
