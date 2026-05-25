import { useCallback, useEffect, useRef, useState } from 'react'

export function useApiData<T>(key: string | null, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    if (key === null) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetcherRef.current()
      .then((result) => {
        if (!cancelled) { setData(result); setLoading(false) }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [key])

  const refetch = useCallback(() => {
    if (key === null) return
    setLoading(true)
    setError(null)
    fetcherRef.current()
      .then((result) => { setData(result); setLoading(false) })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unknown error')
        setLoading(false)
      })
  }, [key])

  return { data, loading, error, refetch }
}
