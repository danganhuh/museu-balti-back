import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { crudCreate, crudDelete, crudList, crudUpdate } from '../../services/api/crudService'
import { generateInvite, listInvites, revokeInvite } from '../../services/api/inviteService'
import type { InviteRecord } from '../../services/api/inviteService'
import './AdminPanel.css'

type EntityTab = 'halls' | 'exhibits' | 'people' | 'timeline' | 'quiz-sets' | 'badges'
type Tab = EntityTab | 'invitations'
type Mode = 'list' | 'edit' | 'new'
type Row = Record<string, unknown>

const ENTITY_TABS: { id: EntityTab; label: string }[] = [
  { id: 'halls', label: 'Halls' },
  { id: 'exhibits', label: 'Exhibits' },
  { id: 'people', label: 'People' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'quiz-sets', label: 'Quiz Sets' },
  { id: 'badges', label: 'Badges' },
]

const TEMPLATES: Record<EntityTab, Row> = {
  halls: {
    id: 'hall-new',
    slug: 'new-hall',
    title: { ro: '', ru: '', en: '' },
    coverImage: 'images/placeholder.jpg',
    order: 99,
  },
  exhibits: {
    id: 'exhibit-new',
    hallId: '',
    slug: 'new-exhibit',
    title: { ro: '', ru: '', en: '' },
    shortDescription: { ro: '', ru: '', en: '' },
    longDescription: { ro: '', ru: '', en: '' },
    era: 'modern',
    category: 'daily_life',
    heroImage: 'images/placeholder.jpg',
    relatedPersonIds: [],
    relatedArtifactIds: [],
    relatedEventIds: [],
    funFacts: { ro: [], ru: [], en: [] },
  },
  people: {
    id: 'person-new',
    slug: 'new-person',
    name: { ro: '', ru: '', en: '' },
    role: { ro: '', ru: '', en: '' },
    bioShort: { ro: '', ru: '', en: '' },
    portraitImage: 'images/placeholder.jpg',
    exhibitIds: [],
  },
  timeline: {
    id: 'event-new',
    year: 2024,
    title: { ro: '', ru: '', en: '' },
    summary: { ro: '', ru: '', en: '' },
    detail: { ro: '', ru: '', en: '' },
    era: 'contemporary',
    relatedExhibitIds: [],
  },
  'quiz-sets': {
    id: 'quiz-new',
    title: { ro: '', ru: '', en: '' },
    passThreshold: 3,
    questions: [
      {
        id: 'q-new-1',
        prompt: { ro: '', ru: '', en: '' },
        choices: [
          { ro: 'Option A', ru: 'Option A', en: 'Option A' },
          { ro: 'Option B', ru: 'Option B', en: 'Option B' },
        ],
        correctIndex: 0,
        explanation: { ro: '', ru: '', en: '' },
      },
    ],
  },
  badges: {
    id: 'badge-new',
    title: { ro: '', ru: '', en: '' },
    description: { ro: '', ru: '', en: '' },
    icon: '⭐',
  },
}

function getItemLabel(row: Row): string {
  const t = row.title as Record<string, string> | undefined
  if (t?.en) return t.en
  if (t?.ro) return t.ro
  const name = row.name as Record<string, string> | undefined
  if (name?.en) return name.en
  if (name?.ro) return name.ro
  return String(row.slug ?? row.id ?? '?')
}

// ── Invitations tab ────────────────────────────────────────────
function InvitationsTab({ token }: { token: string }) {
  const [invites, setInvites] = useState<InviteRecord[]>([])
  const [role, setRole] = useState<'WRITER' | 'ADMIN'>('WRITER')
  const [generated, setGenerated] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try { setInvites(await listInvites(token)) } catch { /* server may be starting */ }
  }, [token])

  useEffect(() => { void load() }, [load])

  const generate = async () => {
    setError(null)
    setGenerated(null)
    try {
      const inv = await generateInvite(token, role)
      setGenerated(inv.code)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate')
    }
  }

  const revoke = async (code: string) => {
    try {
      await revokeInvite(token, code)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to revoke')
    }
  }

  function hoursLeft(expiresAt: string): string {
    const h = Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 3_600_000))
    return `${h}h`
  }

  return (
    <div className="admin-panel__form" style={{ gap: '1rem' }}>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted,#666)' }}>
        Generate a one-time code and share it with the person you want to invite. Codes expire in 24 hours.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'WRITER' | 'ADMIN')}
          className="login-panel__input"
          style={{ flex: '0 0 auto', width: 'auto' }}
        >
          <option value="WRITER">WRITER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="button" className="admin-panel__action-btn admin-panel__action-btn--primary" onClick={() => void generate()}>
          Generate Invite Code
        </button>
        <button type="button" className="admin-panel__action-btn" onClick={() => void load()}>
          ↻ Refresh
        </button>
      </div>

      {generated && (
        <div className="admin-panel__invite-code">
          <span className="admin-panel__invite-code__label">New code:</span>
          <code className="admin-panel__invite-code__value">{generated}</code>
          <button
            type="button"
            className="admin-panel__action-btn"
            onClick={() => void navigator.clipboard.writeText(generated)}
          >
            Copy
          </button>
        </div>
      )}

      {error && <p className="admin-panel__error">{error}</p>}

      {invites.length > 0 && (
        <ul className="admin-panel__list">
          {invites.map((inv) => (
            <li key={inv.code} className="admin-panel__item">
              <code className="admin-panel__item-label" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                {inv.code}
              </code>
              <span className="admin-panel__item-id">
                {inv.role} · expires {hoursLeft(inv.expiresAt)}
              </span>
              <div className="admin-panel__item-actions">
                <button
                  type="button"
                  className="admin-panel__action-btn admin-panel__action-btn--danger"
                  onClick={() => void revoke(inv.code)}
                >
                  Revoke
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {invites.length === 0 && (
        <p className="admin-panel__empty">No active invite codes.</p>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export function AdminPanel({ isAdmin }: { isAdmin: boolean }) {
  const { token } = useAuth()
  const [tab, setTab] = useState<Tab>('halls')
  const [mode, setMode] = useState<Mode>('list')
  const [items, setItems] = useState<Row[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [json, setJson] = useState('')
  const [listError, setListError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isEntityTab = (t: Tab): t is EntityTab => t !== 'invitations'

  const loadItems = useCallback(async () => {
    if (!token || !isEntityTab(tab)) return
    setListError(null)
    try {
      setItems(await crudList(tab, token))
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load items')
    }
  }, [tab, token])

  useEffect(() => {
    setMode('list')
    setEditId(null)
    setSaveError(null)
    if (isEntityTab(tab)) void loadItems()
  }, [loadItems, tab])

  const startNew = () => {
    if (!isEntityTab(tab)) return
    setJson(JSON.stringify(TEMPLATES[tab], null, 2))
    setEditId(null)
    setMode('new')
    setSaveError(null)
  }

  // FIX: keep id in the textarea so the backend receives it; we also enforce editId on save
  const startEdit = (row: Row) => {
    setJson(JSON.stringify(row, null, 2))
    setEditId(String(row.id))
    setMode('edit')
    setSaveError(null)
  }

  const cancel = () => { setMode('list'); setEditId(null); setSaveError(null) }

  const save = async () => {
    if (!token) return
    setSaving(true)
    setSaveError(null)
    let parsed: Row
    try {
      parsed = JSON.parse(json) as Row
    } catch {
      setSaveError('Invalid JSON — fix the syntax and try again.')
      setSaving(false)
      return
    }
    try {
      if (mode === 'new') {
        await crudCreate(tab as EntityTab, token, parsed)
      } else if (mode === 'edit' && editId) {
        // Always inject editId to guarantee body.id === URL param
        await crudUpdate(tab as EntityTab, token, editId, { ...parsed, id: editId })
      }
      await loadItems()
      setMode('list')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string, label: string) => {
    if (!token || !isAdmin) return
    if (!window.confirm(`Delete "${label}"?\n\nThis cannot be undone.`)) return
    try {
      await crudDelete(tab as EntityTab, token, id)
      await loadItems()
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const currentTabLabel = ENTITY_TABS.find((t) => t.id === tab)?.label ?? tab

  return (
    <section className="admin-panel card-surface" aria-labelledby="admin-panel-title">
      <h2 id="admin-panel-title" className="cabinet-section__title">
        {isAdmin ? 'Admin Panel' : 'Writer Panel'}
      </h2>
      <p className="admin-panel__role-note">
        {isAdmin
          ? 'Full access — create, edit, delete records and manage invitations.'
          : 'Write access — create and edit records.'}
      </p>

      <div className="admin-panel__tabs" role="tablist">
        {ENTITY_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={['admin-panel__tab', tab === t.id ? 'admin-panel__tab--active' : ''].join(' ')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        {isAdmin && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'invitations'}
            className={['admin-panel__tab', tab === 'invitations' ? 'admin-panel__tab--active' : ''].join(' ')}
            onClick={() => setTab('invitations')}
          >
            Invitations
          </button>
        )}
      </div>

      <div className="admin-panel__content">
        {tab === 'invitations' && token ? (
          <InvitationsTab token={token} />
        ) : mode === 'list' ? (
          <>
            <div className="admin-panel__toolbar">
              <button type="button" className="admin-panel__action-btn admin-panel__action-btn--primary" onClick={startNew}>
                + New {currentTabLabel.replace(/s$/, '')}
              </button>
              <button type="button" className="admin-panel__action-btn" onClick={() => void loadItems()}>
                ↻ Refresh
              </button>
            </div>

            {listError && <p className="admin-panel__error">{listError}</p>}

            <ul className="admin-panel__list">
              {items.map((row, i) => {
                const id = String(row.id ?? i)
                const label = getItemLabel(row)
                return (
                  <li key={id} className="admin-panel__item">
                    <span className="admin-panel__item-label">{label}</span>
                    <span className="admin-panel__item-id">{id}</span>
                    <div className="admin-panel__item-actions">
                      <button type="button" className="admin-panel__action-btn" onClick={() => startEdit(row)}>
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          className="admin-panel__action-btn admin-panel__action-btn--danger"
                          onClick={() => void remove(id, label)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
              {items.length === 0 && !listError && (
                <li className="admin-panel__empty">No {currentTabLabel.toLowerCase()} yet.</li>
              )}
            </ul>
          </>
        ) : (
          <div className="admin-panel__form">
            <p className="admin-panel__form-title">
              {mode === 'new' ? `New ${currentTabLabel.replace(/s$/, '')}` : `Edit  ${editId}`}
            </p>
            {mode === 'edit' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted,#666)', margin: 0 }}>
                The <code>id</code> field is read-only — changing it will be ignored on save.
              </p>
            )}
            <textarea
              className="admin-panel__textarea"
              value={json}
              onChange={(e) => setJson(e.target.value)}
              rows={22}
              spellCheck={false}
              aria-label="JSON editor"
            />
            {saveError && <p className="admin-panel__error">{saveError}</p>}
            <div className="admin-panel__form-actions">
              <button
                type="button"
                className="admin-panel__action-btn admin-panel__action-btn--primary"
                onClick={() => void save()}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="admin-panel__action-btn" onClick={cancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
