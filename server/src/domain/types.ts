/** Mirrors front-end museum types (ro / ru / en). */
export type LanguageCode = 'ro' | 'ru' | 'en'

export type LocalizedString = Record<LanguageCode, string>

export type LocalizedStringList = Record<LanguageCode, readonly string[]>

export type ExhibitEraKey =
  | 'antiquity'
  | 'medieval'
  | 'early_modern'
  | 'modern'
  | 'contemporary'

export type ExhibitCategoryKey =
  | 'architecture'
  | 'numismatics'
  | 'crafts'
  | 'daily_life'
  | 'urbanism'
  | 'personalities'

export type Hall = {
  id: string
  slug: string
  title: LocalizedString
  coverImage: string
  order: number
}

export type Exhibit = {
  id: string
  hallId: string
  slug: string
  title: LocalizedString
  shortDescription: LocalizedString
  longDescription: LocalizedString
  era: ExhibitEraKey
  category: ExhibitCategoryKey
  heroImage: string
  relatedPersonIds: readonly string[]
  relatedArtifactIds: readonly string[]
  relatedEventIds: readonly string[]
  funFacts: LocalizedStringList
}

export type HistoricalPerson = {
  id: string
  slug: string
  name: LocalizedString
  role: LocalizedString
  birthYear?: number
  deathYear?: number
  bioShort: LocalizedString
  portraitImage: string
  exhibitIds: readonly string[]
}

export type TimelineEvent = {
  id: string
  year: number
  title: LocalizedString
  summary: LocalizedString
  detail: LocalizedString
  era: ExhibitEraKey
  image?: string
  relatedExhibitIds: readonly string[]
}

export type QuizQuestion = {
  id: string
  prompt: LocalizedString
  choices: readonly LocalizedString[]
  correctIndex: number
  explanation: LocalizedString
}

export type QuizSet = {
  id: string
  title: LocalizedString
  passThreshold: number
  questions: readonly QuizQuestion[]
}

export type BadgeDefinition = {
  id: string
  title: LocalizedString
  description: LocalizedString
  icon?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  limit: number
  offset: number
}

export type LeaderboardEntry = {
  pseudonym: string
  score: number
  at: string
}
