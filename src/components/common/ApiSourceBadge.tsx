import './ApiSourceBadge.css'

export function ApiSourceBadge({ source }: { source: 'api' | 'local' }) {
  return (
    <span className={`api-source-badge api-source-badge--${source}`}>
      {source === 'api' ? '● Live API' : '◎ Local data'}
    </span>
  )
}
