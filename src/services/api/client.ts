const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?? (import.meta.env.DEV ? 'http://localhost:3001' : '')

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...rest } = options
  const headers = new Headers(rest.headers)
  if (!(rest.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${BASE}${path}`, { ...rest, headers })

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => ({})) as Record<string, unknown>

  if (!res.ok) {
    const err = body?.error as Record<string, string> | undefined
    throw new ApiError(res.status, err?.code ?? 'UNKNOWN', err?.message ?? res.statusText)
  }

  return body as T
}
