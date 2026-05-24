import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { crudCreate, crudDelete, crudList, crudUpdate } from '../../services/api/crudService'
import './AdminPanel.css'

type Tab = 'halls' | 'exhibits' | 'people' | 'timeline' | 'quiz-sets' | 'badges'
type Mode = 'list' | 'edit' | 'new'
type Row = Record<string, unknown>

const TABS: { id: Tab; label: string }[] = [
  { id: 'halls', label: 'Halls' },
  { id: 'exhibits', label: 'Exhibits' },
  { id: 'people', label: 'People' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'quiz-sets', label: 'Quiz Sets' },
  { id: 'badges', label: 'Badges' },
]

const TEMPLATES: Record<Tab, Row> = {
  halls: {
    slug: 'new-hall',
    title: { ro: '', ru: '', en: '' },
    coverImage: 'images/placeholder.jpg',
    order: 99,
  },
  exhibits: {
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
    slug: 'new-person',
    name: { ro: '', ru: '', en: '' },
    role: { ro: '', ru: '', en: '' },
    bioShort: { ro: '', ru: '', en: '' },
    portraitImage: 'images/placeholder.jpg',
    exhibitIds: [],
  },
  timeline: {
    year: 2024,
    title: { ro: '', ru: '', en: '' },
    summary: { ro: '', ru: '', en: '' },
    detail: { ro: '', ru: '', en: '' },
    era: 'contemporary',
    relatedExhibitIds: [],
  },
  'quiz-sets': {
    title: { ro: '', ru: '', en: '' },
    passThreshold: 3,
    questions: [
      {
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

  const loadItems = useCallback(async () => {
    if (!token) return
    setListError(null)
    try {
      const rows = await crudList(tab, token)
      setItems(rows)
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load items')
    }
  }, [tab, token])

  useEffect(() => {
    setMode('list')
    setEditId(null)
    setSaveError(null)
    void loadItems()
  }, [loadItems])

  const startNew = () => {
    setJson(JSON.stringify(TEMPLATES[tab], null, 2))
    setEditId(null)
    setMode('new')
    setSaveError(null)
  }

  const startEdit = (row: Row) => {
    const { id: _id, ...body } = row
    setJson(JSON.stringify(body, null, 2))
    setEditId(String(row.id))
    setMode('edit')
    setSaveError(null)
  }

  const cancel = () => {
    setMode('list')
    setEditId(null)
    setSaveError(null)
  }

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
        await crudCreate(tab, token, parsed)
      } else if (mode === 'edit' && editId) {
        await crudUpdate(tab, token, editId, parsed)
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
      await crudDelete(tab, token, id)
      await loadItems()
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const currentTabLabel = TABS.find((t) => t.id === tab)?.label ?? tab

  return (
    <section className="admin-panel card-surface" aria-labelledby="admin-panel-title">
      <h2 id="admin-panel-title" className="cabinet-section__title">
        {isAdmin ? 'Admin Panel' : 'Writer Panel'}
      </h2>
      <p className="admin-panel__role-note">
        {isAdmin
          ? 'Full access — create, edit and delete records.'
          : 'Write access — create and edit records.'}
      </p>

      <div className="admin-panel__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={[
              'admin-panel__tab',
              tab === t.id ? 'admin-panel__tab--active' : '',
            ].join(' ')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-panel__content">
        {mode === 'list' ? (
          <>
            <div className="admin-panel__toolbar">
              <button
                type="button"
                className="admin-panel__action-btn admin-panel__action-btn--primary"
                onClick={startNew}
              >
                + New {currentTabLabel.replace(/s$/, '')}
              </button>
              <button
                type="button"
                className="admin-panel__action-btn"
                onClick={() => void loadItems()}
              >
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
                      <button
                        type="button"
                        className="admin-panel__action-btn"
                        onClick={() => startEdit(row)}
                      >
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
              {mode === 'new'
                ? `New ${currentTabLabel.replace(/s$/, '')}`
                : `Edit  ${editId}`}
            </p>
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
              <button
                type="button"
                className="admin-panel__action-btn"
                onClick={cancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
