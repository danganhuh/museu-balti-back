import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { LanguageCode } from '../types/settings'
import { pickLocalized } from '../i18n/pickLocalized'
import { badgeCatalog } from '../data/badges'
import { loadBadgeIds, loadLeaderboard, loadQuizProgress } from '../services/storage/interactiveStorage'
import { syncBadges } from '../services/badgeSync'
import { LEADERBOARD_KEYS } from '../constants/leaderboards'
import { LoginPanel } from '../components/auth/LoginPanel'
import { AdminPanel } from '../components/admin/AdminPanel'
import { useAuth } from '../hooks/useAuth'
import { clearAllLeaderboards } from '../services/api/leaderboardService'

export function CabinetPage() {
  const { i18n, t } = useTranslation()
  const language = i18n.language as LanguageCode
  const { token, claims, isExpired } = useAuth()
  const isWriter = !isExpired && (claims?.role === 'WRITER' || claims?.role === 'ADMIN')
  const isAdmin = !isExpired && claims?.role === 'ADMIN'

  const handleClearAllLeaderboards = async () => {
    if (!token) return
    if (!window.confirm('Clear ALL leaderboards? This cannot be undone.')) return
    try {
      await clearAllLeaderboards(token)
      refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to clear leaderboards')
    }
  }
  const [owned, setOwned] = useState<string[]>(() => loadBadgeIds())
  const [boards, setBoards] = useState(() => loadLeaderboard())
  const [quizStats, setQuizStats] = useState(() => loadQuizProgress())

  useEffect(() => {
    syncBadges()
    setOwned(loadBadgeIds())
    setBoards(loadLeaderboard())
    setQuizStats(loadQuizProgress())
  }, [])

  const refresh = () => {
    syncBadges()
    setOwned(loadBadgeIds())
    setBoards(loadLeaderboard())
    setQuizStats(loadQuizProgress())
  }

  const qp = quizStats

  const lbBlocks = useMemo(
    () => [
      { key: LEADERBOARD_KEYS.quizUrban, title: t('leaderboard.blockQuizUrban') },
      { key: LEADERBOARD_KEYS.quizRegion, title: t('leaderboard.blockQuizRegion') },
      { key: LEADERBOARD_KEYS.matchPairs, title: t('leaderboard.blockMatch') },
    ],
    [t],
  )

  return (
    <section className="section--cream cabinet-page">
      <div className="container cabinet-page__inner">
        <LoginPanel />

        {isWriter && <AdminPanel isAdmin={isAdmin} />}

        <header className="cabinet-page__header">
          <p className="halls-page__eyebrow">{t('cabinet.eyebrow')}</p>
          <h1 className="halls-page__title">{t('cabinet.title')}</h1>
          <p className="halls-page__intro">{t('cabinet.intro')}</p>
          <div className="cabinet-page__actions">
            <button type="button" className="btn btn--ghost" onClick={refresh}>
              {t('cabinet.refresh')}
            </button>
            <Link className="btn btn--primary" to="/quiz">
              {t('cabinet.gotoQuiz')}
            </Link>
            <Link className="btn btn--ghost" to="/games">
              {t('cabinet.gotoGames')}
            </Link>
            <Link className="btn btn--ghost" to="/timeline">
              {t('cabinet.gotoTimeline')}
            </Link>
          </div>
        </header>

        <section className="cabinet-stats card-surface" aria-labelledby="cabinet-stats-title">
          <h2 id="cabinet-stats-title" className="cabinet-section__title">
            {t('cabinet.statsTitle')}
          </h2>
          <ul className="cabinet-stats__list">
            <li>{t('cabinet.statUrban', { n: qp['quiz-balti-urban']?.bestScore ?? 0 })}</li>
            <li>{t('cabinet.statRegion', { n: qp['quiz-region']?.bestScore ?? 0 })}</li>
          </ul>
        </section>

        <section className="cabinet-badges" aria-labelledby="cabinet-badges-title">
          <h2 id="cabinet-badges-title" className="cabinet-section__title">
            {t('cabinet.badgesTitle')}
          </h2>
          <ul className="badge-grid">
            {badgeCatalog.map((b) => {
              const has = owned.includes(b.id)
              return (
                <li key={b.id} className={['badge-card', has ? 'badge-card--owned' : 'badge-card--locked'].join(' ')}>
                  <span className="badge-card__icon" aria-hidden>
                    {has ? b.icon ?? '⭐' : '🔒'}
                  </span>
                  <h3 className="badge-card__title">{pickLocalized(language, b.title)}</h3>
                  <p className="badge-card__desc">{pickLocalized(language, b.description)}</p>
                  {!has ? <p className="badge-card__hint">{t('cabinet.lockedHint')}</p> : null}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="cabinet-lb" aria-labelledby="cabinet-lb-title">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 id="cabinet-lb-title" className="cabinet-section__title" style={{ margin: 0 }}>
              {t('leaderboard.title')}
            </h2>
            {isAdmin && (
              <button
                type="button"
                className="btn btn--ghost"
                style={{ fontSize: '0.8rem' }}
                onClick={() => void handleClearAllLeaderboards()}
              >
                Clear All
              </button>
            )}
          </div>
          <p className="cabinet-lb__note">{t('leaderboard.note')}</p>
          <div className="leaderboard-grid">
            {lbBlocks.map((block) => (
              <div key={block.key} className="leaderboard-card card-surface">
                <h3 className="leaderboard-card__title">{block.title}</h3>
                <ol className="leaderboard-card__list">
                  {(boards[block.key] ?? []).map((row, i) => (
                    <li key={`${row.pseudonym}-${row.at}-${i}`} className="leaderboard-card__row">
                      <span className="leaderboard-card__rank">{i + 1}</span>
                      <span className="leaderboard-card__name">{row.pseudonym}</span>
                      <span className="leaderboard-card__score">{row.score}</span>
                    </li>
                  ))}
                </ol>
                {(boards[block.key] ?? []).length === 0 ? <p className="leaderboard-card__empty">{t('leaderboard.empty')}</p> : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
