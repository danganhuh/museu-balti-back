import type {
  ChronologyProgress,
  HiddenRelicProgress,
  LeaderboardEntry,
  LeaderboardMap,
  MatchGameProgress,
  QuizProgressMap,
} from '../../types/interactive'
import { STORAGE_KEYS } from './keys'
import { writeRawJsonKey } from './userCollectionsStorage'

const emptyQuizProgress: QuizProgressMap = {}
const emptyLeaderboard: LeaderboardMap = {}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null || raw === '') return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadSeenEventIds(): string[] {
  const v = readJson<unknown>(STORAGE_KEYS.seenEvents, [])
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

export function saveSeenEventIds(ids: readonly string[]): void {
  writeRawJsonKey(STORAGE_KEYS.seenEvents, [...new Set(ids)])
}

export function markEventSeen(eventId: string): void {
  const cur = loadSeenEventIds()
  if (cur.includes(eventId)) return
  saveSeenEventIds([...cur, eventId])
}

/** Mirrors BAZA `vitrina:timelineSolved` — chronology mission completion. */
export function loadTimelineSolvedFlag(): boolean {
  const raw = localStorage.getItem(STORAGE_KEYS.timelineSolved)
  if (raw === 'true') return true
  const v = readJson<{ chronology?: boolean } | boolean>(STORAGE_KEYS.timelineSolved, false)
  if (typeof v === 'boolean') return v
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    return (v as { chronology?: boolean }).chronology === true
  }
  return false
}

export function saveTimelineSolvedFlag(solved: boolean): void {
  writeRawJsonKey(STORAGE_KEYS.timelineSolved, { chronology: solved })
}

export function loadChronologyProgress(): ChronologyProgress {
  const v = readJson<unknown>(STORAGE_KEYS.gameChronology, {})
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    return { completed: false, attempts: 0 }
  }
  const o = v as Record<string, unknown>
  return {
    completed: o.completed === true,
    attempts: typeof o.attempts === 'number' && Number.isFinite(o.attempts) ? Math.max(0, o.attempts) : 0,
    lastSolvedAt: typeof o.lastSolvedAt === 'string' ? o.lastSolvedAt : undefined,
  }
}

export function saveChronologyProgress(p: ChronologyProgress): void {
  writeRawJsonKey(STORAGE_KEYS.gameChronology, p)
}

export function loadQuizProgress(): QuizProgressMap {
  const v = readJson<unknown>(STORAGE_KEYS.quizProgress, emptyQuizProgress)
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
  const out: QuizProgressMap = {}
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (!val || typeof val !== 'object' || Array.isArray(val)) continue
    const o = val as Record<string, unknown>
    const bestScore = typeof o.bestScore === 'number' ? Math.min(5, Math.max(0, o.bestScore)) : 0
    const attempts = typeof o.attempts === 'number' ? Math.max(0, o.attempts) : 0
    const lastPlayedAt = typeof o.lastPlayedAt === 'string' ? o.lastPlayedAt : new Date(0).toISOString()
    out[k] = { bestScore, attempts, lastPlayedAt }
  }
  return out
}

export function saveQuizProgress(map: QuizProgressMap): void {
  writeRawJsonKey(STORAGE_KEYS.quizProgress, map)
}

export function loadBadgeIds(): string[] {
  const v = readJson<unknown>(STORAGE_KEYS.badges, [])
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

export function saveBadgeIds(ids: readonly string[]): void {
  writeRawJsonKey(STORAGE_KEYS.badges, [...new Set(ids)])
}

export function awardBadgeIfNew(badgeId: string): boolean {
  const cur = loadBadgeIds()
  if (cur.includes(badgeId)) return false
  saveBadgeIds([...cur, badgeId])
  return true
}

export function loadLeaderboard(): LeaderboardMap {
  const v = readJson<unknown>(STORAGE_KEYS.leaderboard, emptyLeaderboard)
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
  const out: LeaderboardMap = {}
  for (const [gameKey, arr] of Object.entries(v as Record<string, unknown>)) {
    if (!Array.isArray(arr)) continue
    const entries: LeaderboardEntry[] = []
    for (const item of arr) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue
      const o = item as Record<string, unknown>
      const pseudonym = typeof o.pseudonym === 'string' ? o.pseudonym.trim() : ''
      const score = typeof o.score === 'number' && Number.isFinite(o.score) ? o.score : 0
      const at = typeof o.at === 'string' ? o.at : new Date().toISOString()
      if (pseudonym.length >= 2) entries.push({ pseudonym, score, at })
    }
    out[gameKey] = entries
  }
  return out
}

export function saveLeaderboard(map: LeaderboardMap): void {
  writeRawJsonKey(STORAGE_KEYS.leaderboard, map)
}

/** Insert entry, keep top 5 by score (then recency). */
export function submitLeaderboardEntry(gameKey: string, entry: LeaderboardEntry): LeaderboardEntry[] {
  const all = loadLeaderboard()
  const prev = all[gameKey] ?? []
  const next = [...prev, entry]
    .sort((a, b) => b.score - a.score || new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5)
  all[gameKey] = next
  saveLeaderboard(all)
  return next
}

export function loadMatchGameProgress(): MatchGameProgress {
  const v = readJson<unknown>(STORAGE_KEYS.gameMatch, {})
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    return { bestMoves: Number.POSITIVE_INFINITY, completedCount: 0 }
  }
  const o = v as Record<string, unknown>
  const rawBest = o.bestMoves
  const bestMoves =
    typeof rawBest === 'number' && Number.isFinite(rawBest)
      ? rawBest
      : rawBest === null
        ? Number.POSITIVE_INFINITY
        : Number.POSITIVE_INFINITY
  const completedCount = typeof o.completedCount === 'number' ? Math.max(0, o.completedCount) : 0
  return {
    bestMoves,
    completedCount,
    lastPlayedAt: typeof o.lastPlayedAt === 'string' ? o.lastPlayedAt : undefined,
  }
}

export function saveMatchGameProgress(p: MatchGameProgress): void {
  writeRawJsonKey(STORAGE_KEYS.gameMatch, {
    bestMoves: Number.isFinite(p.bestMoves) ? p.bestMoves : null,
    completedCount: p.completedCount,
    lastPlayedAt: p.lastPlayedAt,
  })
}

export function loadHiddenRelicProgress(): HiddenRelicProgress {
  const v = readJson<unknown>(STORAGE_KEYS.gameHiddenRelic, {})
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    return { bestTimeMs: Number.POSITIVE_INFINITY, wins: 0 }
  }
  const o = v as Record<string, unknown>
  const rawT = o.bestTimeMs
  const bestTimeMs =
    typeof rawT === 'number' && Number.isFinite(rawT) ? rawT : rawT === null ? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY
  return {
    bestTimeMs,
    wins: typeof o.wins === 'number' ? Math.max(0, o.wins) : 0,
    lastPlayedAt: typeof o.lastPlayedAt === 'string' ? o.lastPlayedAt : undefined,
  }
}

export function saveHiddenRelicProgress(p: HiddenRelicProgress): void {
  writeRawJsonKey(STORAGE_KEYS.gameHiddenRelic, {
    bestTimeMs: Number.isFinite(p.bestTimeMs) ? p.bestTimeMs : null,
    wins: p.wins,
    lastPlayedAt: p.lastPlayedAt,
  })
}

export function clearAllProgress(): void {
  const keys = [
    STORAGE_KEYS.seenEvents,
    STORAGE_KEYS.timelineSolved,
    STORAGE_KEYS.quizProgress,
    STORAGE_KEYS.badges,
    STORAGE_KEYS.leaderboard,
    STORAGE_KEYS.gameChronology,
    STORAGE_KEYS.gameMatch,
    STORAGE_KEYS.gameHiddenRelic,
  ]
  for (const key of keys) {
    localStorage.removeItem(key)
  }
}
