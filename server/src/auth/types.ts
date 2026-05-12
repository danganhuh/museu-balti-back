export const PERMISSIONS = ['READ', 'WRITE', 'DELETE'] as const
export type Permission = (typeof PERMISSIONS)[number]

export const ROLES = ['ADMIN', 'WRITER', 'VISITOR'] as const
export type Role = (typeof ROLES)[number]

export type AccessTokenClaims = {
  sub: string
  role: Role
  permissions: Permission[]
}
