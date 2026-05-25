import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { STORAGE_KEYS } from '../services/storage/keys'
import { adminLogin as apiAdminLogin, redeemInvite as apiRedeemInvite } from '../services/api/authService'
import type { Permission, TokenClaims } from '../services/api/types'

function decodeJwt(token: string): TokenClaims | null {
  try {
    const seg = token.split('.')[1]
    if (!seg) return null
    const b64 = seg.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded)) as TokenClaims
  } catch {
    return null
  }
}

function isTokenExpired(claims: TokenClaims): boolean {
  return claims.exp * 1000 < Date.now() - 5_000
}

type AuthContextValue = {
  token: string | null
  claims: TokenClaims | null
  isExpired: boolean
  hasPermission: (p: Permission) => boolean
  adminLogin: (secret: string) => Promise<void>
  redeemInvite: (code: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEYS.token) } catch { return null }
  })

  const claims = token ? decodeJwt(token) : null
  const isExpired = claims ? isTokenExpired(claims) : false

  useEffect(() => {
    try {
      if (token) localStorage.setItem(STORAGE_KEYS.token, token)
      else localStorage.removeItem(STORAGE_KEYS.token)
    } catch { /* quota or private mode */ }
  }, [token])

  const adminLogin = useCallback(async (secret: string) => {
    const res = await apiAdminLogin(secret)
    setToken(res.accessToken)
  }, [])

  const redeemInvite = useCallback(async (code: string) => {
    const res = await apiRedeemInvite(code)
    setToken(res.accessToken)
  }, [])

  const logout = useCallback(() => setToken(null), [])

  const hasPermission = useCallback(
    (p: Permission) => (claims?.permissions ?? []).includes(p),
    [claims],
  )

  return (
    <AuthContext.Provider value={{ token, claims, isExpired, hasPermission, adminLogin, redeemInvite, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
