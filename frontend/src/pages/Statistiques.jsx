import { useMemo, useState } from 'react'
import { BarChart2, TrendingUp, Zap, Calendar, Award } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { StatCard, Alert, Empty } from '../components/ui'
import { ConsommationAreaChart, ConsommationBarChart, AppareilPieChart } from '../components/charts'
import { useConsommations, useStats } from '../hooks/useData'
import { fmtDate, groupByMonth, last7Days, appareilColor, fmtEuros } from '../utils/helpers'
import clsx from 'clsx'

const PERIODS = [
  { label: '7 jours',  value: '7j'  },
  { label: '30 jours', value: '30j' },
  { label: 'Mensuel',  value: 'mois' },
]

export default function Statistiques() {
  const { data,         loading: loadConso, error }  = useConsommations()
  const { totalKwh, moyenneKwh, parAppareil, loading: loadStats } = useStats()
  const [period, setPeriod] = useState('7j')

  /* ── Données graphique principal ─────────────────────────────────── */
  const chartData = useMemo(() => {
    if (!data) return []
    if (period === '7j')   return last7Days(data)
    if (period === '30j')  return last30Days(data)
    if (period === 'mois') return groupByMonth(data)
    return []
  }, [data, period])

  /* ── Meilleur & pire jour ────────────────────────────────────────── */
  const { best, worst } = useMemo(() => {
    if (!data?.length) return { best: null, worst: null }
    const sorted = [...data].sort((a, b) => parseFloat(a.kwh) - parseFloat(b.kwh))
    return { best: sorted[0], worst: sorted[sorted.length - 1] }
  }, [data])

  /* ── Nombre de saisies ce mois ───────────────────────────────────── */
  const saisiesCeMois = useMemo(() => {
    if (!data) return 0
    const now = new Date()
    const m = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
    return data.filter(c => c.date_mesure?.startsWith(m)).length
  }, [data])

  const totalCeMois = useMemo(() => {
    if (!data) return 0
    const now = new Date()
    const m = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
    return data.filter(c => c.date_mesure?.startsWith(m)).reduce((s,c) => s + parseFloat(c.kwh||0), 0)
  }, [data])

  const loading = loadConso || loadStats

  return (
    <Layout
      title="Statistiques"
      subtitle="Analyse détaillée de vos consommations"
    >
      {error && <Alert type="error" className="mb-5">{error}</Alert>}

      {/* ── KPIs ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total général"
          value={totalKwh ? parseFloat(totalKwh).toFixed(1) : null}
          unit="kWh"
          icon={Zap} color="green" loading={loading}
          trendLabel={`≈ ${totalKwh ? (parseFloat(totalKwh) * 0.2516).toFixed(2) : '—'} €`}
        />
        <StatCard
          label="Moy. par saisie"
          value={moyenneKwh ? parseFloat(moyenneKwh).toFixed(2) : null}
          unit="kWh"
          icon={TrendingUp} color="blue" loading={loading}
          trendLabel="tous enregistrements"
        />
        <StatCard
          label="Ce mois-ci"
          value={loading ? null : totalCeMois.toFixed(1)}
          unit="kWh"
          icon={Calendar} color="orange" loading={loading}
          trendLabel={`${saisiesCeMois} saisie${saisiesCeMois !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Nb. appareils"
          value={loading ? null : (parAppareil?.length ?? 0)}
          icon={BarChart2} color="yellow" loading={loading}
          trendLabel="avec des données"
        />
      </div>

      {/* ── Graphique principal ──────────────────────────────────────── */}
      <div className="card-p mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-ttl">Évolution de la consommation</p>
            <p className="text-xs text-ink-3 mt-0.5">Consommation totale en kWh</p>
          </div>
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-white/[0.05]">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                  period === p.value
                    ? 'bg-accent-green/15 text-accent-green border border-accent-green/25'
                    : 'text-ink-3 hover:text-ink-2'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading
          ? <div className="skeleton h-[220px] w-full" />
          : !chartData.length || chartData.every(d => d.total === 0)
            ? <Empty message="Pas de données pour cette période" icon={BarChart2} />
            : period === 'mois'
              ? <ConsommationBarChart data={chartData} />
              : <ConsommationAreaChart data={chartData} />
        }
      </div>

      {/* ── Bottom row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Répartition appareils */}
        <div className="card-p">
          <p className="section-ttl mb-1">Répartition par appareil</p>
          <p className="text-xs text-ink-3 mb-4">Part de consommation totale</p>
          {loading
            ? <div className="skeleton h-[220px] w-full" />
            : !parAppareil?.length
              ? <Empty message="Aucun appareil renseigné" />
              : <AppareilPieChart data={parAppareil} />
          }
        </div>

        {/* Classement appareils */}
        <div className="card-p">
          <p className="section-ttl mb-4">Classement appareils</p>
          {loading
            ? <div className="space-y-2">{[...Array(5)].map((_,i)=><div key={i} className="skeleton h-9 w-full" />)}</div>
            : !parAppareil?.length
              ? <Empty message="Aucune donnée" />
              : (() => {
                  const max = parseFloat(parAppareil[0]?.total_kwh) || 1
                  return (
                    <div className="space-y-2.5">
                      {parAppareil.slice(0, 7).map((a, i) => {
                        const val = parseFloat(a.total_kwh)
                        const pct = (val / max) * 100
                        const col = appareilColor(a.appareil)
                        return (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-ink-2 flex items-center gap-1.5">
                                {i === 0 && <Award size={11} className="text-accent-yellow" />}
                                {a.appareil || 'Non défini'}
                              </span>
                              <span className="text-xs font-mono font-semibold" style={{ color: col }}>
                                {val.toFixed(1)} kWh
                              </span>
                            </div>
                            <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, background: col }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()
          }
        </div>

        {/* Records & insights */}
        <div className="card-p">
          <p className="section-ttl mb-4">Insights</p>
          <div className="space-y-3">
            {best && (
              <div className="p-3 bg-accent-green/8 border border-accent-green/18 rounded-xl">
                <p className="text-xs font-semibold text-accent-green mb-0.5">🏆 Meilleure journée</p>
                <p className="text-lg font-display font-bold text-ink">{parseFloat(best.kwh).toFixed(2)} <span className="text-sm font-normal text-ink-3">kWh</span></p>
                <p className="text-xs text-ink-3 font-mono">{fmtDate(best.date_mesure)}</p>
                {best.appareil && <p className="text-xs text-ink-3 mt-0.5">{best.appareil}</p>}
              </div>
            )}
            {worst && worst.id !== best?.id && (
              <div className="p-3 bg-accent-red/8 border border-accent-red/18 rounded-xl">
                <p className="text-xs font-semibold text-accent-red mb-0.5">⚠️ Pic de consommation</p>
                <p className="text-lg font-display font-bold text-ink">{parseFloat(worst.kwh).toFixed(2)} <span className="text-sm font-normal text-ink-3">kWh</span></p>
                <p className="text-xs text-ink-3 font-mono">{fmtDate(worst.date_mesure)}</p>
                {worst.appareil && <p className="text-xs text-ink-3 mt-0.5">{worst.appareil}</p>}
              </div>
            )}
            {!loading && data?.length > 0 && (
              <div className="p-3 bg-surface-3 border border-white/[0.06] rounded-xl">
                <p className="text-xs font-semibold text-ink-2 mb-0.5">📦 Total enregistrements</p>
                <p className="text-lg font-display font-bold text-ink">{data.length}</p>
                <p className="text-xs text-ink-3">saisies au total</p>
              </div>
            )}
            {loading && <div className="space-y-2">{[...Array(3)].map((_,i)=><div key={i} className="skeleton h-20 w-full" />)}</div>}
          </div>
        </div>
      </div>
    </Layout>
  )
}

/* ── Helpers locaux ──────────────────────────────────────────────────── */
function last30Days(consommations) {
  if (!consommations?.length) return []
  const today  = new Date()
  const result = []
  for (let i = 29; i >= 0; i--) {
    const d   = new Date(today)
    d.setDate(today.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const lbl = `${d.getDate()}/${d.getMonth()+1}`
    const tot = consommations
      .filter(c => c.date_mesure === iso)
      .reduce((s, c) => s + parseFloat(c.kwh || 0), 0)
    result.push({ date: iso, label: lbl, total: parseFloat(tot.toFixed(2)) })
  }
  // Regrouper par tranches de 3 jours pour lisibilité
  const grouped = []
  for (let i = 0; i < result.length; i += 3) {
    const chunk = result.slice(i, i + 3)
    grouped.push({
      label: chunk[0].label,
      total: parseFloat(chunk.reduce((s, d) => s + d.total, 0).toFixed(2)),
    })
  }
  return grouped
}
