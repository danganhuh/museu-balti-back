import { apiFetch } from './client'
import type { LeaderboardEntry } from './types'

export async function fetchLeaderboard(token: string, key: string): Promise<LeaderboardEntry[]> {
  return apiFetch<LeaderboardEntry[]>(`/api/leaderboard/${encodeURIComponent(key)}`, { token })
}

export async function submitScore(
  token: string,
  key: string,
  pseudonym: string,
  score: number,
): Promise<LeaderboardEntry> {
  return apiFetch<LeaderboardEntry>(`/api/leaderboard/${encodeURIComponent(key)}`, {
    method: 'POST',
    body: JSON.stringify({ pseudonym, score }),
    token,
  })
}

export async function clearLeaderboard(token: string, key: string): Promise<void> {
  return apiFetch<void>(`/api/leaderboard/${encodeURIComponent(key)}`, {
    method: 'DELETE',
    token,
  })
}

export async function clearAllLeaderboards(token: string): Promise<void> {
  return apiFetch<void>('/api/leaderboard', { method: 'DELETE', token })
}
