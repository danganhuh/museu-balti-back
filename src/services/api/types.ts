export type Role = 'ADMIN' | 'WRITER' | 'VISITOR'
export type Permission = 'READ' | 'WRITE' | 'DELETE'

export type TokenClaims = {
  sub: string
  role: Role
  permissions: Permission[]
  exp: number
  iat: number
}

export type TokenResponse = {
  accessToken: string
  tokenType: string
  expiresIn: string
  role: Role
  permissions: Permission[]
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  limit: number
  offset: number
}

export type LocalizedString = { ro: string; ru: string; en: string }
export type LocalizedStringList = { ro: string[]; ru: string[]; en: string[] }
export type ExhibitEra = 'antiquity' | 'medieval' | 'early_modern' | 'modern' | 'contemporary'
export type ExhibitCategory = 'architecture' | 'numismatics' | 'crafts' | 'daily_life' | 'urbanism' | 'personalities'

export type Hall = {
  id: string; slug: string; title: LocalizedString; coverImage: string; order: number
}

export type Exhibit = {
  id: string; hallId: string; slug: string
  title: LocalizedString; shortDescription: LocalizedString
  longDescription: LocalizedString; era: ExhibitEra; category: ExhibitCategory
  heroImage: string; relatedPersonIds: string[]; relatedArtifactIds: string[]
  relatedEventIds: string[]; funFacts: LocalizedStringList
}

export type HistoricalPerson = {
  id: string; slug: string; name: LocalizedString; role: LocalizedString
  birthYear?: number; deathYear?: number; bioShort: LocalizedString
  portraitImage: string; exhibitIds: string[]
}

export type TimelineEvent = {
  id: string; year: number; title: LocalizedString; summary: LocalizedString
  detail: LocalizedString; era: ExhibitEra; image?: string; relatedExhibitIds: string[]
}

export type QuizQuestion = {
  id: string; prompt: LocalizedString; choices: LocalizedString[]
  correctIndex: number; explanation: LocalizedString
}

export type QuizSet = {
  id: string; title: LocalizedString; passThreshold: number; questions: QuizQuestion[]
}

export type BadgeDefinition = {
  id: string; title: LocalizedString; description: LocalizedString; icon?: string
}

export type LeaderboardEntry = { pseudonym: string; score: number; at: string }
