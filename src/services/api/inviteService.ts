import { apiFetch } from './client'

export type InviteRecord = {
  code: string
  role: 'ADMIN' | 'WRITER'
  createdAt: string
  expiresAt: string
  usedAt?: string
}

export async function generateInvite(token: string, role: 'WRITER' | 'ADMIN'): Promise<InviteRecord> {
  return apiFetch<InviteRecord>('/api/admin/invites', {
    method: 'POST',
    body: JSON.stringify({ role }),
    token,
  })
}

export async function listInvites(token: string): Promise<InviteRecord[]> {
  return apiFetch<InviteRecord[]>('/api/admin/invites', { token })
}

export async function revokeInvite(token: string, code: string): Promise<void> {
  return apiFetch<void>(`/api/admin/invites/${encodeURIComponent(code)}`, {
    method: 'DELETE',
    token,
  })
}
