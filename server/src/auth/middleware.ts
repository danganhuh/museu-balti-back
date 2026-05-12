import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Permission } from './types.js'
import { verifyAccessToken } from './jwt.js'

function extractBearer(req: Request): string | null {
  const h = req.headers.authorization
  if (!h || typeof h !== 'string') return null
  const [scheme, token] = h.split(/\s+/, 2)
  if (!token || scheme?.toLowerCase() !== 'bearer') return null
  return token.trim() || null
}

/** Attaches `req.auth` when the Bearer token is present and valid (signature, expiry, issuer). */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearer(req)
  if (!token) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header (expected Bearer token).' } })
    return
  }

  try {
    req.auth = verifyAccessToken(token)
    next()
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: 'JWT has expired.' } })
      return
    }
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: { code: 'INVALID_TOKEN', message: e.message } })
      return
    }
    throw e
  }
}

/** Use after `requireAuth`. Returns 403 if the token is valid but lacks any of the required permissions. */
export function requirePermissions(...required: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const auth = req.auth
    if (!auth) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } })
      return
    }

    const granted = new Set(auth.permissions)
    const missing = required.filter((p) => !granted.has(p))
    if (missing.length > 0) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Insufficient permissions. Required: ${required.join(', ')}. Missing: ${missing.join(', ')}.`,
        },
      })
      return
    }

    next()
  }
}
