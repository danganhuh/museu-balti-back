import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider'
import './LoginPanel.css'

type PanelMode = 'idle' | 'admin-login' | 'invite'

const ROLE_LABELS: Record<string, string> = {
  VISITOR: 'Read-only — browse halls, exhibits and timeline',
  WRITER:  'Read + Write — browse and manage museum content',
  ADMIN:   'Full access — manage content, users and leaderboard',
}

function useCountdown(expSec: number | undefined): string {
  const [label, setLabel] = useState('')
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!expSec) { setLabel(''); return }
    const tick = () => {
      const secs = Math.floor((expSec * 1000 - Date.now()) / 1000)
      if (secs <= 0) { setLabel('Expired'); if (ref.current) clearInterval(ref.current) }
      else setLabel(`${secs}s`)
    }
    tick()
    ref.current = setInterval(tick, 1000)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [expSec])

  return label
}

export function LoginPanel() {
  const { token, claims, isExpired, adminLogin, redeemInvite, logout } = useAuth()
  const [mode, setMode] = useState<PanelMode>('idle')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const countdown = useCountdown(claims?.exp)
  const isLoggedIn = !!token && !isExpired

  const reset = (next: PanelMode = 'idle') => {
    setMode(next)
    setError(null)
    setSecret('')
    setCode('')
  }

  const handleAdminLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await adminLogin(secret)
      reset()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async () => {
    setLoading(true)
    setError(null)
    try {
      await redeemInvite(code.trim())
      reset()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-panel card-surface" aria-labelledby="login-panel-title">
      <h2 id="login-panel-title" className="cabinet-section__title">Access Level</h2>

      {isLoggedIn ? (
        <div className="login-panel__active">
          <div className="login-panel__badge-row">
            <span className={`role-badge role-badge--${claims!.role.toLowerCase()}`}>
              {claims!.role}
            </span>
            <span className="login-panel__perms">
              {claims!.permissions.join(' · ')}
            </span>
            <span className={`login-panel__timer ${countdown === 'Expired' ? 'login-panel__timer--expired' : ''}`}>
              {countdown}
            </span>
          </div>
          <p className="login-panel__desc">{ROLE_LABELS[claims!.role]}</p>
          <button type="button" className="btn btn--ghost" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          {isExpired && (
            <p className="login-panel__warning">Session expired — please log in again.</p>
          )}

          {mode === 'idle' && (
            <div className="login-panel__guest">
              <p className="login-panel__desc">
                All museum content is publicly accessible. Log in for write or admin access.
              </p>
              <div className="login-panel__row">
                <button type="button" className="btn btn--ghost" onClick={() => setMode('admin-login')}>
                  Admin Login
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setMode('invite')}>
                  Use Invite Code
                </button>
              </div>
            </div>
          )}

          {mode === 'admin-login' && (
            <div className="login-panel__form">
              <div className="login-panel__row">
                <label htmlFor="admin-secret" className="login-panel__label">Secret</label>
                <input
                  id="admin-secret"
                  type="password"
                  className="login-panel__input"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleAdminLogin()}
                  placeholder="Admin secret"
                  autoFocus
                />
              </div>
              {error && <p className="login-panel__error">{error}</p>}
              <div className="login-panel__row">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => void handleAdminLogin()}
                  disabled={loading || !secret}
                >
                  {loading ? 'Logging in…' : 'Log in'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => reset()}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {mode === 'invite' && (
            <div className="login-panel__form">
              <div className="login-panel__row">
                <label htmlFor="invite-code" className="login-panel__label">Code</label>
                <input
                  id="invite-code"
                  type="text"
                  className="login-panel__input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleRedeem()}
                  placeholder="INV-XXXXXXXX"
                  autoFocus
                />
              </div>
              {error && <p className="login-panel__error">{error}</p>}
              <div className="login-panel__row">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => void handleRedeem()}
                  disabled={loading || !code.trim()}
                >
                  {loading ? 'Checking…' : 'Redeem'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => reset()}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
