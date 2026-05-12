import jwt, { type SignOptions } from 'jsonwebtoken'
import { isPermission, isRole } from './roles.js'
import type { AccessTokenClaims, Permission, Role } from './types.js'

const ISSUER = 'lab6-api'

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (secret && secret.length > 0) return secret
  return 'dev-insecure-jwt-secret-do-not-use-in-production'
}

export function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN?.trim() || '60s'
}

export function warnIfInsecureJwtSecret(): void {
  if (!process.env.JWT_SECRET?.trim()) {
    console.warn(
      '[lab6-api] JWT_SECRET is not set; tokens are signed with a dev-only default. Set JWT_SECRET in production.',
    )
  }
}

export function signAccessToken(claims: AccessTokenClaims): string {
  return jwt.sign(claims, getSecret(), {
    algorithm: 'HS256',
    expiresIn: getJwtExpiresIn() as NonNullable<SignOptions['expiresIn']>,
    issuer: ISSUER,
  })
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  const decoded = jwt.verify(token, getSecret(), {
    algorithms: ['HS256'],
    issuer: ISSUER,
  })

  if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
    throw new jwt.JsonWebTokenError('Invalid payload')
  }

  const { sub, role, permissions } = decoded as jwt.JwtPayload & Record<string, unknown>

  if (typeof sub !== 'string' || !sub) {
    throw new jwt.JsonWebTokenError('Invalid sub')
  }
  if (typeof role !== 'string' || !isRole(role)) {
    throw new jwt.JsonWebTokenError('Invalid role')
  }
  if (!Array.isArray(permissions)) {
    throw new jwt.JsonWebTokenError('Invalid permissions')
  }

  const normalizedPerms: Permission[] = []
  for (const p of permissions) {
    if (typeof p !== 'string' || !isPermission(p)) {
      throw new jwt.JsonWebTokenError('Invalid permissions')
    }
    normalizedPerms.push(p)
  }

  return {
    sub,
    role: role as Role,
    permissions: normalizedPerms,
  }
}
