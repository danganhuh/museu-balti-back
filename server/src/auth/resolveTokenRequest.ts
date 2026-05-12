import type { Permission, Role } from './types.js'
import { isPermission, isRole, roleDefaultPermissions } from './roles.js'

export type TokenRequestInput = {
  role?: string | undefined
  permissions?: Permission[] | undefined
}

function uniqueSorted(perms: Iterable<Permission>): Permission[] {
  return [...new Set(perms)].sort()
}

/**
 * Resolves role and permissions for a new token.
 * - Default role when omitted: `VISITOR`.
 * - Permissions = union(role defaults, explicit permissions from request).
 */
export function resolveTokenClaims(input: TokenRequestInput): { role: Role; permissions: Permission[] } {
  const role: Role = input.role != null && input.role !== '' ? parseRole(input.role) : 'VISITOR'

  const fromRole = roleDefaultPermissions[role]
  const merged = new Set<Permission>(fromRole)

  if (input.permissions?.length) {
    for (const raw of input.permissions) {
      merged.add(parsePermission(String(raw)))
    }
  }

  return { role, permissions: uniqueSorted(merged) }
}

export function parseRole(value: string): Role {
  const normalized = value.trim().toUpperCase()
  if (!isRole(normalized)) {
    const err = new Error(`Invalid role: ${value}`)
    ;(err as NodeJS.ErrnoException).code = 'INVALID_ROLE'
    throw err
  }
  return normalized
}

export function parsePermission(value: string): Permission {
  const normalized = value.trim().toUpperCase()
  if (!isPermission(normalized)) {
    const err = new Error(`Invalid permission: ${value}`)
    ;(err as NodeJS.ErrnoException).code = 'INVALID_PERMISSION'
    throw err
  }
  return normalized
}

/** Parse `READ,WRITE` or single value from query string. */
export function parsePermissionsQuery(raw: string | undefined): Permission[] | undefined {
  if (raw == null || raw.trim() === '') return undefined
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  return parts.map(parsePermission)
}

export function parsePermissionsBody(value: unknown): Permission[] | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) {
    const err = new Error('permissions must be an array of strings when provided')
    ;(err as NodeJS.ErrnoException).code = 'INVALID_PERMISSION'
    throw err
  }
  return value.map((item, i) => {
    if (typeof item !== 'string') {
      const err = new Error(`permissions[${i}] must be a string`)
      ;(err as NodeJS.ErrnoException).code = 'INVALID_PERMISSION'
      throw err
    }
    return parsePermission(item)
  })
}
