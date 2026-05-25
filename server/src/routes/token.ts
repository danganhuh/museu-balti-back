import type { Response } from 'express'
import { Router } from 'express'
import { getJwtExpiresIn, signAccessToken } from '../auth/jwt.js'
import {
  parsePermissionsBody,
  parsePermissionsQuery,
  resolveTokenClaims,
} from '../auth/resolveTokenRequest.js'

const DEMO_SUB = 'lab6-demo-client'

const router = Router()

function sendTokenError(res: Response, status: number, message: string): void {
  res.status(status).json({ error: { code: 'BAD_REQUEST', message } })
}

router.get('/token', (req, res) => {
  try {
    const roleRaw = typeof req.query.role === 'string' ? req.query.role : undefined
    const permissionsRaw =
      typeof req.query.permissions === 'string' ? req.query.permissions : undefined

    const explicit = parsePermissionsQuery(permissionsRaw)

    const { role: resolvedRole, permissions } = resolveTokenClaims({
      role: roleRaw,
      permissions: explicit,
    })

    if (resolvedRole !== 'VISITOR') {
      sendTokenError(res, 403, 'This endpoint only issues VISITOR tokens. Use /auth/admin-login or /auth/redeem for elevated access.')
      return
    }
    const claims = { sub: DEMO_SUB, role: resolvedRole, permissions }
    const accessToken = signAccessToken(claims)
    res.status(200).json({
      accessToken,
      tokenType: 'Bearer',
      expiresIn: getJwtExpiresIn(),
      role: resolvedRole,
      permissions,
    })
  } catch (e) {
    const code = e && typeof e === 'object' && 'code' in e ? String((e as { code?: string }).code) : ''
    if (code === 'INVALID_ROLE' || code === 'INVALID_PERMISSION') {
      sendTokenError(res, 400, e instanceof Error ? e.message : 'Invalid input')
      return
    }
    throw e
  }
})

router.post('/token', (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {}

    const roleRaw = typeof body.role === 'string' ? body.role : undefined
    const explicit = parsePermissionsBody(body.permissions)

    const { role: resolvedRole, permissions } = resolveTokenClaims({
      role: roleRaw,
      permissions: explicit,
    })

    if (resolvedRole !== 'VISITOR') {
      sendTokenError(res, 403, 'This endpoint only issues VISITOR tokens. Use /auth/admin-login or /auth/redeem for elevated access.')
      return
    }
    const claims = { sub: DEMO_SUB, role: resolvedRole, permissions }
    const accessToken = signAccessToken(claims)
    res.status(200).json({
      accessToken,
      tokenType: 'Bearer',
      expiresIn: getJwtExpiresIn(),
      role: resolvedRole,
      permissions,
    })
  } catch (e) {
    const code = e && typeof e === 'object' && 'code' in e ? String((e as { code?: string }).code) : ''
    if (code === 'INVALID_ROLE' || code === 'INVALID_PERMISSION') {
      sendTokenError(res, 400, e instanceof Error ? e.message : 'Invalid input')
      return
    }
    throw e
  }
})

export const tokenRouter = router
