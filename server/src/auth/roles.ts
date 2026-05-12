import type { Permission, Role } from './types.js'

/** Default permissions per role; explicit `permissions` in /token requests are merged (union). */
export const roleDefaultPermissions: Record<Role, readonly Permission[]> = {
  ADMIN: ['READ', 'WRITE', 'DELETE'],
  WRITER: ['READ', 'WRITE'],
  VISITOR: ['READ'],
}

export function isRole(value: string): value is Role {
  return value === 'ADMIN' || value === 'WRITER' || value === 'VISITOR'
}

export function isPermission(value: string): value is Permission {
  return value === 'READ' || value === 'WRITE' || value === 'DELETE'
}
