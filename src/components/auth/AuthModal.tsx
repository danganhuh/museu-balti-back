import { useEffect } from 'react'
import { LoginPanel } from './LoginPanel'
import './AuthModal.css'

interface Props {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="auth-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="Access Level"
    >
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" type="button" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <LoginPanel />
      </div>
    </div>
  )
}
