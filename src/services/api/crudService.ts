import { apiFetch } from './client'
import type { PaginatedResponse } from './types'

type EntityRow = Record<string, unknown>

const ENTITY_PATH: Record<string, string> = {
  halls: '/api/halls',
  exhibits: '/api/exhibits',
  people: '/api/historical-people',
  timeline: '/api/timeline-events',
  'quiz-sets': '/api/quiz-sets',
  badges: '/api/badge-definitions',
}

export async function crudList(entity: string, token: string): Promise<EntityRow[]> {
  const res = await apiFetch<PaginatedResponse<EntityRow>>(
    `${ENTITY_PATH[entity]}?limit=100`,
    { token },
  )
  return res.data
}

export async function crudCreate(entity: string, token: string, body: EntityRow): Promise<EntityRow> {
  return apiFetch<EntityRow>(ENTITY_PATH[entity], {
    method: 'POST',
    body: JSON.stringify(body),
    token,
  })
}

export async function crudUpdate(
  entity: string,
  token: string,
  id: string,
  body: EntityRow,
): Promise<EntityRow> {
  return apiFetch<EntityRow>(`${ENTITY_PATH[entity]}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    token,
  })
}

export async function crudDelete(entity: string, token: string, id: string): Promise<void> {
  return apiFetch<void>(`${ENTITY_PATH[entity]}/${id}`, {
    method: 'DELETE',
    token,
  })
}
