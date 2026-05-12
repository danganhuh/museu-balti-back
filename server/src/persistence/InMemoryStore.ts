import type { Exhibit, Hall, HistoricalPerson, TimelineEvent } from '../domain/types.js'
import type { PaginatedResponse } from '../domain/types.js'

function clone<T>(v: T): T {
  return structuredClone(v)
}

function paginate<T>(items: T[], offset: number, limit: number): PaginatedResponse<T> {
  const total = items.length
  const slice = items.slice(offset, offset + limit)
  return { data: slice, total, limit, offset }
}

export class InMemoryStore {
  private halls = new Map<string, Hall>()
  private exhibits = new Map<string, Exhibit>()
  private people = new Map<string, HistoricalPerson>()
  private timeline = new Map<string, TimelineEvent>()

  constructor(seed?: {
    halls?: Hall[]
    exhibits?: Exhibit[]
    people?: HistoricalPerson[]
    timelineEvents?: TimelineEvent[]
  }) {
    if (seed?.halls) for (const h of seed.halls) this.halls.set(h.id, clone(h))
    if (seed?.exhibits) for (const e of seed.exhibits) this.exhibits.set(e.id, clone(e))
    if (seed?.people) for (const p of seed.people) this.people.set(p.id, clone(p))
    if (seed?.timelineEvents) for (const t of seed.timelineEvents) this.timeline.set(t.id, clone(t))
  }

  // --- Halls ---
  listHalls(offset: number, limit: number): PaginatedResponse<Hall> {
    const sorted = [...this.halls.values()].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    return paginate(sorted, offset, limit)
  }

  getHall(id: string): Hall | undefined {
    const h = this.halls.get(id)
    return h ? clone(h) : undefined
  }

  hallSlugTaken(slug: string, exceptId?: string): boolean {
    for (const h of this.halls.values()) {
      if (h.slug === slug && h.id !== exceptId) return true
    }
    return false
  }

  createHall(hall: Hall): void {
    if (this.halls.has(hall.id)) throw Object.assign(new Error('Hall id already exists'), { statusCode: 409 })
    if (this.hallSlugTaken(hall.slug)) throw Object.assign(new Error('Hall slug already exists'), { statusCode: 409 })
    this.halls.set(hall.id, clone(hall))
  }

  updateHall(id: string, hall: Hall): void {
    if (!this.halls.has(id)) throw Object.assign(new Error('Hall not found'), { statusCode: 404 })
    if (hall.id !== id) throw Object.assign(new Error('Hall id mismatch'), { statusCode: 400 })
    if (this.hallSlugTaken(hall.slug, id)) throw Object.assign(new Error('Hall slug already exists'), { statusCode: 409 })
    this.halls.set(id, clone(hall))
  }

  deleteHall(id: string): boolean {
    return this.halls.delete(id)
  }

  // --- Exhibits ---
  listExhibits(
    offset: number,
    limit: number,
    filters: { hallId?: string; era?: string; category?: string },
  ): PaginatedResponse<Exhibit> {
    let list = [...this.exhibits.values()]
    if (filters.hallId) list = list.filter((e) => e.hallId === filters.hallId)
    if (filters.era) list = list.filter((e) => e.era === filters.era)
    if (filters.category) list = list.filter((e) => e.category === filters.category)
    list.sort((a, b) => a.id.localeCompare(b.id))
    return paginate(list, offset, limit)
  }

  getExhibit(id: string): Exhibit | undefined {
    const e = this.exhibits.get(id)
    return e ? clone(e) : undefined
  }

  exhibitSlugTaken(slug: string, exceptId?: string): boolean {
    for (const e of this.exhibits.values()) {
      if (e.slug === slug && e.id !== exceptId) return true
    }
    return false
  }

  createExhibit(ex: Exhibit): void {
    if (this.exhibits.has(ex.id)) throw Object.assign(new Error('Exhibit id already exists'), { statusCode: 409 })
    if (!this.halls.has(ex.hallId)) throw Object.assign(new Error('hallId does not reference an existing hall'), { statusCode: 400 })
    if (this.exhibitSlugTaken(ex.slug)) throw Object.assign(new Error('Exhibit slug already exists'), { statusCode: 409 })
    this.exhibits.set(ex.id, clone(ex))
  }

  updateExhibit(id: string, ex: Exhibit): void {
    if (!this.exhibits.has(id)) throw Object.assign(new Error('Exhibit not found'), { statusCode: 404 })
    if (ex.id !== id) throw Object.assign(new Error('Exhibit id mismatch'), { statusCode: 400 })
    if (!this.halls.has(ex.hallId)) throw Object.assign(new Error('hallId does not reference an existing hall'), { statusCode: 400 })
    if (this.exhibitSlugTaken(ex.slug, id)) throw Object.assign(new Error('Exhibit slug already exists'), { statusCode: 409 })
    this.exhibits.set(id, clone(ex))
  }

  deleteExhibit(id: string): boolean {
    return this.exhibits.delete(id)
  }

  // --- People ---
  listPeople(offset: number, limit: number): PaginatedResponse<HistoricalPerson> {
    const sorted = [...this.people.values()].sort((a, b) => a.slug.localeCompare(b.slug))
    return paginate(sorted, offset, limit)
  }

  getPerson(id: string): HistoricalPerson | undefined {
    const p = this.people.get(id)
    return p ? clone(p) : undefined
  }

  personSlugTaken(slug: string, exceptId?: string): boolean {
    for (const p of this.people.values()) {
      if (p.slug === slug && p.id !== exceptId) return true
    }
    return false
  }

  createPerson(p: HistoricalPerson): void {
    if (this.people.has(p.id)) throw Object.assign(new Error('Person id already exists'), { statusCode: 409 })
    if (this.personSlugTaken(p.slug)) throw Object.assign(new Error('Person slug already exists'), { statusCode: 409 })
    this.people.set(p.id, clone(p))
  }

  updatePerson(id: string, p: HistoricalPerson): void {
    if (!this.people.has(id)) throw Object.assign(new Error('Person not found'), { statusCode: 404 })
    if (p.id !== id) throw Object.assign(new Error('Person id mismatch'), { statusCode: 400 })
    if (this.personSlugTaken(p.slug, id)) throw Object.assign(new Error('Person slug already exists'), { statusCode: 409 })
    this.people.set(id, clone(p))
  }

  deletePerson(id: string): boolean {
    return this.people.delete(id)
  }

  // --- Timeline ---
  listTimelineEvents(offset: number, limit: number): PaginatedResponse<TimelineEvent> {
    const sorted = [...this.timeline.values()].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id))
    return paginate(sorted, offset, limit)
  }

  getTimelineEvent(id: string): TimelineEvent | undefined {
    const t = this.timeline.get(id)
    return t ? clone(t) : undefined
  }

  createTimelineEvent(t: TimelineEvent): void {
    if (this.timeline.has(t.id)) throw Object.assign(new Error('Timeline event id already exists'), { statusCode: 409 })
    this.timeline.set(t.id, clone(t))
  }

  updateTimelineEvent(id: string, t: TimelineEvent): void {
    if (!this.timeline.has(id)) throw Object.assign(new Error('Timeline event not found'), { statusCode: 404 })
    if (t.id !== id) throw Object.assign(new Error('Timeline event id mismatch'), { statusCode: 400 })
    this.timeline.set(id, clone(t))
  }

  deleteTimelineEvent(id: string): boolean {
    return this.timeline.delete(id)
  }
}
