/** Prefix and keys aligned with BAZA-LABORATOR.md §9 */
export const STORAGE_PREFIX = 'vitrina:' as const

export const STORAGE_KEYS = {
  schemaVersion: `${STORAGE_PREFIX}schemaVersion`,
  settings: `${STORAGE_PREFIX}settings`,
  favorites: `${STORAGE_PREFIX}favorites`,
  album: `${STORAGE_PREFIX}album`,
  studiedExhibits: `${STORAGE_PREFIX}studiedExhibits`,
  exhibitFilters: `${STORAGE_PREFIX}exhibitFilters`,
  seenEvents: `${STORAGE_PREFIX}seenEvents`,
  timelineSolved: `${STORAGE_PREFIX}timelineSolved`,
  quizProgress: `${STORAGE_PREFIX}quizProgress`,
  badges: `${STORAGE_PREFIX}badges`,
  leaderboard: `${STORAGE_PREFIX}leaderboard`,
  gameChronology: `${STORAGE_PREFIX}game:chronology:main`,
  gameMatch: `${STORAGE_PREFIX}game:match:main`,
  gameHiddenRelic: `${STORAGE_PREFIX}game:hiddenRelic:main`,
  token: `${STORAGE_PREFIX}token`,
} as const

/** Bump when persisted shape changes; handled in migrateStorage(). */
export const CURRENT_SCHEMA_VERSION = 2
