import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LanguageCode } from '../types/settings'
import type { QuizSet } from '../types/interactive'
import { quizSets as staticQuizSets } from '../data/quizzes'
import { QuizRunner } from '../components/quiz/QuizRunner'
import { listQuizSets } from '../services/api/museumService'
import { useApiData } from '../hooks/useApiData'

export function QuizPage() {
  const { i18n, t } = useTranslation()
  const language = i18n.language as LanguageCode

  const { data } = useApiData('quiz-sets', listQuizSets)
  const apiQuizSets = data?.data as QuizSet[] | undefined
  const quizList: readonly QuizSet[] =
    apiQuizSets && apiQuizSets.length > 0 ? apiQuizSets : staticQuizSets

  const [active, setActive] = useState(0)
  const safeActive = Math.min(active, quizList.length - 1)
  const quiz = quizList[safeActive]

  const tabs = useMemo(
    () =>
      quizList.map((q, i) => ({
        id: q.id,
        label: q.title[language] ?? q.title.ro,
        index: i,
      })),
    [quizList, language],
  )

  return (
    <section className="section--cream quiz-page">
      <div className="container quiz-page__inner">
        <header className="quiz-page__header">
          <p className="halls-page__eyebrow">{t('quiz.eyebrow')}</p>
          <h1 className="halls-page__title">{t('quiz.title')}</h1>
          <p className="halls-page__intro">{t('quiz.intro')}</p>
        </header>
        <div className="quiz-tabs" role="tablist" aria-label={t('quiz.tablistLabel')}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={safeActive === tab.index}
              className={['quiz-tabs__btn', safeActive === tab.index ? 'quiz-tabs__btn--active' : ''].filter(Boolean).join(' ')}
              onClick={() => setActive(tab.index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <QuizRunner key={quiz.id} quiz={quiz} language={language} />
      </div>
    </section>
  )
}
