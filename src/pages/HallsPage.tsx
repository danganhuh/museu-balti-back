import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getOrderedHalls } from '../data/catalog'
import { HallCard } from '../components/exhibits/HallCard'
import type { Hall } from '../types/museum'
import { listHalls } from '../services/api/museumService'
import { useApiData } from '../hooks/useApiData'
import { ApiSourceBadge } from '../components/common/ApiSourceBadge'

export function HallsPage() {
  const { t } = useTranslation()

  // GET /api/halls is now public — no token required
  const { data, loading, error } = useApiData('halls', listHalls)

  const staticHalls = useMemo(() => getOrderedHalls() as Hall[], [])
  const apiHalls = data?.data as Hall[] | undefined
  const source = apiHalls ? 'api' : 'local'
  const list = apiHalls ?? staticHalls

  return (
    <section className="halls-page section--cream" aria-labelledby="halls-title">
      <div className="container halls-page__inner">
        <header className="halls-page__header">
          <p className="halls-page__eyebrow">{t('halls.eyebrow')}</p>
          <h1 id="halls-title" className="halls-page__title">
            {t('halls.title')}
          </h1>
          <p className="halls-page__intro">{t('halls.intro')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
            <ApiSourceBadge source={source} />
            {loading && (
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted, #666)' }}>
                Loading from API…
              </span>
            )}
            {error && (
              <span style={{ fontSize: '0.78rem', color: '#856404' }}>
                API unavailable — showing local data.
              </span>
            )}
          </div>
        </header>
        <div className="exhibitions__grid halls-page__grid" role="list">
          {list.map((hall) => (
            <div key={hall.id} className="halls-page__cell" role="listitem">
              <HallCard hall={hall} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
