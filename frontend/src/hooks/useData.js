import { useState, useEffect, useCallback, useRef } from 'react'
import { consommationApi, statsApi } from '../services/api'

export function useFetch(fn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const alive = useRef(true)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try   { const r = await fn(); if (alive.current) setData(r) }
    catch (e) { if (alive.current) setError(e.message) }
    finally   { if (alive.current) setLoading(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    alive.current = true
    load()
    return () => { alive.current = false }
  }, [load])

  return { data, loading, error, refetch: load }
}

export function useConsommations() {
  return useFetch(() => consommationApi.getAll())
}

export function useStats() {
  const total  = useFetch(() => statsApi.totalKwh())
  const moy    = useFetch(() => statsApi.moyenneKwh())
  const parApp = useFetch(() => statsApi.parAppareil())
  return {
    totalKwh:    total.data?.total_kwh   ?? null,
    moyenneKwh:  moy.data?.moyenne_kwh  ?? null,
    parAppareil: parApp.data            ?? [],
    loading:     total.loading || moy.loading || parApp.loading,
    error:       total.error  || moy.error    || parApp.error,
    refetch:     () => { total.refetch(); moy.refetch(); parApp.refetch() },
  }
}
