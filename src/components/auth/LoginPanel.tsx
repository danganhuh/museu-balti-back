import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider'
import type { Role } from '../../services/api/types'
import './LoginPanel.css'

const ROLES: Role[] = ['VISITOR', 'WRITER', 'ADMIN']

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  VISITOR: 'Read-only — browse halls, exhibits and timeline',
  WRITER:  'Read + Write — everything above plus create & edit museum objects',
  ADMIN:   'Full access — everything above plus delete records and clear leaderboard',
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
  const { token, claims, isExpired, login, logout } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role>('VISITOR')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const countdown = useCountdown(claims?.exp)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await login(selectedRole)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach API server')
    } finally {
      setLoading(false)
    }
  }

  const isLoggedIn = !!token && !isExpired

  return (
    <section className="login-panel card-surface" aria-labelledby="login-panel-title">
      <h2 id="login-panel-title" className="cabinet-section__title">API Access</h2>

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
          <p className="login-panel__desc">{ROLE_DESCRIPTIONS[claims!.role]}</p>
          <button type="button" className="btn btn--ghost" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="login-panel__form">
          {isExpired && (
            <p className="login-panel__warning">Session expired — please log in again.</p>
          )}
          <div className="login-panel__row">
            <label htmlFor="role-select" className="login-panel__label">Role</label>
            <select
              id="role-select"
              className="login-panel__select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <p className="login-panel__desc">{ROLE_DESCRIPTIONS[selectedRole]}</p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Connecting…' : 'Get Token (1 min)'}
          </button>
          {error && <p className="login-panel__error">{error}</p>}
        </div>
      )}
    </section>
  )
}
