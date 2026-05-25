import { apiFetch } from './client'
import type { TokenResponse } from './types'

export async function adminLogin(secret: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ secret }),
  })
}

export async function redeemInvite(code: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/redeem', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
}
