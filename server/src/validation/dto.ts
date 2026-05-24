import type {
  BadgeDefinition,
  Exhibit,
  ExhibitCategoryKey,
  ExhibitEraKey,
  Hall,
  HistoricalPerson,
  LocalizedString,
  LocalizedStringList,
  QuizQuestion,
  QuizSet,
  TimelineEvent,
} from '../domain/types.js'

const ERAS: ExhibitEraKey[] = ['antiquity', 'medieval', 'early_modern', 'modern', 'contemporary']
const CATEGORIES: ExhibitCategoryKey[] = [
  'architecture',
  'numismatics',
  'crafts',
  'daily_life',
  'urbanism',
  'personalities',
]

function bad(message: string): never {
  throw Object.assign(new Error(message), { statusCode: 400 })
}

export function parseLocalizedString(value: unknown, field: string): LocalizedString {
  if (!value || typeof value !== 'object') bad(`${field} must be an object with ro, ru, en strings`)
  const o = value as Record<string, unknown>
  const ro = typeof o.ro === 'string' ? o.ro.trim() : ''
  const ru = typeof o.ru === 'string' ? o.ru.trim() : ''
  const en = typeof o.en === 'string' ? o.en.trim() : ''
  if (!ro || !ru || !en) bad(`${field} must include non-empty ro, ru, and en strings`)
  return { ro, ru, en }
}

export function parseLocalizedStringList(value: unknown, field: string): LocalizedStringList {
  if (!value || typeof value !== 'object') bad(`${field} must be an object with ro, ru, en string arrays`)
  const o = value as Record<string, unknown>
  const parseList = (v: unknown, lang: string): readonly string[] => {
    if (!Array.isArray(v)) bad(`${field}.${lang} must be an array of strings`)
    return v.map((item, i) => {
      if (typeof item !== 'string' || !item.trim()) bad(`${field}.${lang}[${i}] must be a non-empty string`)
      return item.trim()
    })
  }
  return {
    ro: parseList(o.ro, 'ro'),
    ru: parseList(o.ru, 'ru'),
    en: parseList(o.en, 'en'),
  }
}

export function parseNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) bad(`${field} must be a non-empty string`)
  return value.trim()
}

export function parseOptionalNumber(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'number' || !Number.isFinite(value)) bad(`${field} must be a finite number when provided`)
  return value
}

export function parsePositiveInt(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) bad(`${field} must be a non-negative integer`)
  return value
}

export function parseEra(value: unknown, field: string): ExhibitEraKey {
  if (typeof value !== 'string' || !ERAS.includes(value as ExhibitEraKey)) {
    bad(`${field} must be one of: ${ERAS.join(', ')}`)
  }
  return value as ExhibitEraKey
}

export function parseCategory(value: unknown, field: string): ExhibitCategoryKey {
  if (typeof value !== 'string' || !CATEGORIES.includes(value as ExhibitCategoryKey)) {
    bad(`${field} must be one of: ${CATEGORIES.join(', ')}`)
  }
  return value as ExhibitCategoryKey
}

export function parseId(value: unknown, field: string): string {
  return parseNonEmptyString(value, field)
}

export function parseStringArray(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value)) bad(`${field} must be an array of strings`)
  return value.map((item, i) => {
    if (typeof item !== 'string' || !item.trim()) bad(`${field}[${i}] must be a non-empty string`)
    return item.trim()
  })
}

export function parseOptionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'string') bad(`${field} must be a string when provided`)
  const t = value.trim()
  return t === '' ? undefined : t
}

export function parseHallBody(body: unknown): Hall {
  if (!body || typeof body !== 'object') bad('Body must be a JSON object')
  const b = body as Record<string, unknown>
  return {
    id: parseId(b.id, 'id'),
    slug: parseNonEmptyString(b.slug, 'slug'),
    title: parseLocalizedString(b.title, 'title'),
    coverImage: parseNonEmptyString(b.coverImage, 'coverImage'),
    order: parsePositiveInt(b.order, 'order'),
  }
}

export function parseExhibitBody(body: unknown): Exhibit {
  if (!body || typeof body !== 'object') bad('Body must be a JSON object')
  const b = body as Record<string, unknown>
  return {
    id: parseId(b.id, 'id'),
    hallId: parseNonEmptyString(b.hallId, 'hallId'),
    slug: parseNonEmptyString(b.slug, 'slug'),
    title: parseLocalizedString(b.title, 'title'),
    shortDescription: parseLocalizedString(b.shortDescription, 'shortDescription'),
    longDescription: parseLocalizedString(b.longDescription, 'longDescription'),
    era: parseEra(b.era, 'era'),
    category: parseCategory(b.category, 'category'),
    heroImage: parseNonEmptyString(b.heroImage, 'heroImage'),
    relatedPersonIds: parseStringArray(b.relatedPersonIds ?? [], 'relatedPersonIds'),
    relatedArtifactIds: parseStringArray(b.relatedArtifactIds ?? [], 'relatedArtifactIds'),
    relatedEventIds: parseStringArray(b.relatedEventIds ?? [], 'relatedEventIds'),
    funFacts: parseLocalizedStringList(b.funFacts, 'funFacts'),
  }
}

export function parseHistoricalPersonBody(body: unknown): HistoricalPerson {
  if (!body || typeof body !== 'object') bad('Body must be a JSON object')
  const b = body as Record<string, unknown>
  return {
    id: parseId(b.id, 'id'),
    slug: parseNonEmptyString(b.slug, 'slug'),
    name: parseLocalizedString(b.name, 'name'),
    role: parseLocalizedString(b.role, 'role'),
    birthYear: parseOptionalNumber(b.birthYear, 'birthYear'),
    deathYear: parseOptionalNumber(b.deathYear, 'deathYear'),
    bioShort: parseLocalizedString(b.bioShort, 'bioShort'),
    portraitImage: parseNonEmptyString(b.portraitImage, 'portraitImage'),
    exhibitIds: parseStringArray(b.exhibitIds ?? [], 'exhibitIds'),
  }
}

export function parseTimelineEventBody(body: unknown): TimelineEvent {
  if (!body || typeof body !== 'object') bad('Body must be a JSON object')
  const b = body as Record<string, unknown>
  const year =
    typeof b.year === 'number' && Number.isFinite(b.year) && Math.floor(b.year) === b.year
      ? (b.year as number)
      : bad('year must be an integer')
  return {
    id: parseId(b.id, 'id'),
    year,
    title: parseLocalizedString(b.title, 'title'),
    summary: parseLocalizedString(b.summary, 'summary'),
    detail: parseLocalizedString(b.detail, 'detail'),
    era: parseEra(b.era, 'era'),
    image: parseOptionalString(b.image, 'image'),
    relatedExhibitIds: parseStringArray(b.relatedExhibitIds ?? [], 'relatedExhibitIds'),
  }
}

export function parseQuizQuestion(value: unknown, field: string): QuizQuestion {
  if (!value || typeof value !== 'object') bad(`${field} must be an object`)
  const q = value as Record<string, unknown>
  if (!Array.isArray(q.choices)) bad(`${field}.choices must be an array`)
  const choices = (q.choices as unknown[]).map((c, i) =>
    parseLocalizedString(c, `${field}.choices[${i}]`),
  )
  if (choices.length < 2) bad(`${field}.choices must have at least 2 options`)
  const correctIndex =
    typeof q.correctIndex === 'number' && Number.isInteger(q.correctIndex)
      ? q.correctIndex
      : bad(`${field}.correctIndex must be an integer`)
  if (correctIndex < 0 || correctIndex >= choices.length)
    bad(`${field}.correctIndex out of bounds (0–${choices.length - 1})`)
  return {
    id: parseId(q.id, `${field}.id`),
    prompt: parseLocalizedString(q.prompt, `${field}.prompt`),
    choices,
    correctIndex,
    explanation: parseLocalizedString(q.explanation, `${field}.explanation`),
  }
}

export function parseQuizSetBody(body: unknown): QuizSet {
  if (!body || typeof body !== 'object') bad('Body must be a JSON object')
  const b = body as Record<string, unknown>
  if (!Array.isArray(b.questions) || b.questions.length === 0)
    bad('questions must be a non-empty array')
  const questions = (b.questions as unknown[]).map((q, i) => parseQuizQuestion(q, `questions[${i}]`))
  const passThreshold =
    typeof b.passThreshold === 'number' &&
    Number.isInteger(b.passThreshold) &&
    b.passThreshold >= 0
      ? b.passThreshold
      : bad('passThreshold must be a non-negative integer')
  if (passThreshold > questions.length)
    bad(`passThreshold (${passThreshold}) cannot exceed number of questions (${questions.length})`)
  return {
    id: parseId(b.id, 'id'),
    title: parseLocalizedString(b.title, 'title'),
    passThreshold,
    questions,
  }
}

export function parseBadgeBody(body: unknown): BadgeDefinition {
  if (!body || typeof body !== 'object') bad('Body must be a JSON object')
  const b = body as Record<string, unknown>
  return {
    id: parseId(b.id, 'id'),
    title: parseLocalizedString(b.title, 'title'),
    description: parseLocalizedString(b.description, 'description'),
    icon: parseOptionalString(b.icon, 'icon'),
  }
}
