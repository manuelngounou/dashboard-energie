import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook générique : charge des données depuis une fonction async.
 * Retourne { data, loading, error, refetch }
 */
export function useFetch(fetchFn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      if (mountedRef.current) setData(result)
    } catch (e) {
      if (mountedRef.current) setError(e.message)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    mountedRef.current = true
    load()
    return () => { mountedRef.current = false }
  }, [load])

  return { data, loading, error, refetch: load }
}

// ── Hooks spécialisés ────────────────────────────────────────────────────
import { consommationApi, statsApi } from '../services/api'

export function useConsommations() {
  return useFetch(() => consommationApi.getAll())
}

export function useStats() {
  const total   = useFetch(() => statsApi.totalKwh())
  const moyenne = useFetch(() => statsApi.moyenneKwh())
  const parApp  = useFetch(() => statsApi.parAppareil())

  return {
    totalKwh:   total.data?.total_kwh   ?? null,
    moyenneKwh: moyenne.data?.moyenne_kwh ?? null,
    parAppareil: parApp.data ?? [],
    loading:    total.loading || moyenne.loading || parApp.loading,
    error:      total.error  || moyenne.error    || parApp.error,
    refetch:    () => { total.refetch(); moyenne.refetch(); parApp.refetch() },
  }
}
