import type { AccessTokenClaims } from './auth/types.js'

declare global {
  namespace Express {
    interface Request {
      auth?: AccessTokenClaims
    }
  }
}

export {}
