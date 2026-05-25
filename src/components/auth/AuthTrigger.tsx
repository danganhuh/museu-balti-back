import { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProvider'
import { AuthModal } from './AuthModal'
import './AuthTrigger.css'

export function AuthTrigger() {
  const { claims, isExpired } = useAuth()
  const [open, setOpen] = useState(false)
  const isLoggedIn = !!claims && !isExpired
  const role = claims?.role

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <button
        type="button"
        className={['auth-trigger', isLoggedIn ? `auth-trigger--${role?.toLowerCase()}` : ''].join(' ').trim()}
        onClick={() => setOpen(true)}
        aria-label="Access Level"
        title="Access Level (Ctrl+Shift+A)"
      >
        {isLoggedIn ? (
          <span className="auth-trigger__role">{role}</span>
        ) : (
          <span className="auth-trigger__icon">🔑</span>
        )}
      </button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
