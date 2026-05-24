import { apiFetch } from './client'
import type { PaginatedResponse, Hall, Exhibit, HistoricalPerson, TimelineEvent, QuizSet, BadgeDefinition } from './types'

export async function listHalls(token: string): Promise<PaginatedResponse<Hall>> {
  return apiFetch<PaginatedResponse<Hall>>('/api/halls?limit=100', { token })
}

export async function listExhibits(token: string, hallId?: string): Promise<PaginatedResponse<Exhibit>> {
  const qs = hallId ? `?hallId=${encodeURIComponent(hallId)}&limit=100` : '?limit=100'
  return apiFetch<PaginatedResponse<Exhibit>>(`/api/exhibits${qs}`, { token })
}

export async function listPeople(token: string): Promise<PaginatedResponse<HistoricalPerson>> {
  return apiFetch<PaginatedResponse<HistoricalPerson>>('/api/historical-people?limit=100', { token })
}

export async function listTimelineEvents(token: string): Promise<PaginatedResponse<TimelineEvent>> {
  return apiFetch<PaginatedResponse<TimelineEvent>>('/api/timeline-events?limit=100', { token })
}

export async function listQuizSets(token: string): Promise<PaginatedResponse<QuizSet>> {
  return apiFetch<PaginatedResponse<QuizSet>>('/api/quiz-sets?limit=100', { token })
}

export async function listBadges(token: string): Promise<PaginatedResponse<BadgeDefinition>> {
  return apiFetch<PaginatedResponse<BadgeDefinition>>('/api/badge-definitions?limit=100', { token })
}
