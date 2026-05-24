const MAX_LIMIT = 100
const DEFAULT_LIMIT = 20

export type ParsedPagination = {
  limit: number
  offset: number
}

export function parsePagination(query: Record<string, unknown>): ParsedPagination {
  const limitRaw = query.limit
  const offsetRaw = query.offset

  let limit = typeof limitRaw === 'string' ? Number.parseInt(limitRaw, 10) : DEFAULT_LIMIT
  let offset = typeof offsetRaw === 'string' ? Number.parseInt(offsetRaw, 10) : 0

  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT
  if (limit > MAX_LIMIT) limit = MAX_LIMIT
  if (!Number.isFinite(offset) || offset < 0) offset = 0

  return { limit, offset }
}
