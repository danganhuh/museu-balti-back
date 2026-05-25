import { apiFetch } from './client'
import type { Role, Permission, TokenResponse } from './types'

export async function fetchToken(role: Role, permissions?: Permission[]): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/token', {
    method: 'POST',
    body: JSON.stringify({ role, ...(permissions ? { permissions } : {}) }),
  })
}
