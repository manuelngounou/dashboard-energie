import { useState, useMemo } from 'react'
import { BarChart2, Zap, Calendar, Award, TrendingDown, Flame, Leaf } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { StatCard, Alert, Empty } from '../components/ui'
import { ConsommationAreaChart, ConsommationBarChart, AppareilPieChart } from '../components/charts'
import { useConsommations, useStats } from '../hooks/useData'
import { fmtDate, groupByMonth, last7Days, last30Days, appareilChartColor } from '../utils/helpers'
import clsx from 'clsx'

const PERIODS = [
  { label: '7 jours',  value: '7j'   },
  { label: '30 jours', value: '30j'  },
  { label: 'Mensuel',  value: 'mois' },
]

export default function Statistiques() {
  const { data,       loading: lC, error } = useConsommations()
  const { totalKwh, moyenneKwh, parAppareil, loading: lS } = useStats()
  const [period, setPeriod] = useState('7j')

  const chartData = useMemo(() => {
    if (!data) return []
    if (period === '7j')   return last7Days(data)
    if (period === '30j')  return last30Days(data)
    if (period === 'mois') return groupByMonth(data)
    return []
  }, [data, period])

  const { best, worst } = useMemo(() => {
    if (!data?.length) return { best: null, worst: null }
    const s = [...data].sort((a, b) => parseFloat(a.kwh) - parseFloat(b.kwh))
    return { best: s[0], worst: s[s.length - 1] }
  }, [data])

  const { saisiesMois, totalMois } = useMemo(() => {
    if (!data) return { saisiesMois: 0, totalMois: 0 }
    const m = new Date().toISOString().slice(0, 7)
    const rows = data.filter(c => c.date_mesure?.startsWith(m))
    return { saisiesMois: rows.length, totalMois: rows.reduce((s, c) => s + parseFloat(c.kwh || 0), 0) }
  }, [data])

  const loading = lC || lS
  const tot = parseFloat(totalKwh) || 0

  return (
    <Layout title="Statistiques" subtitle="Analyse complète de vos consommations">
      {error && <Alert type="error" className="mb-5">{error}</Alert>}

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total général"  value={tot ? tot.toFixed(1) : null} unit="kWh" icon={Zap}
                  gradient="linear-gradient(135deg,#14b8b8,#0e9b9b)" loading={loading}
                  trendLabel={`≈ ${(tot * 0.2516).toFixed(2)} €`} />
        <StatCard label="Moy. / saisie"  value={moyenneKwh ? parseFloat(moyenneKwh).toFixed(2) : null} unit="kWh"
                  icon={BarChart2} gradient="linear-gradient(135deg,#8b5cf6,#7c3aed)" loading={loading}
                  trendLabel="par enregistrement" />
        <StatCard label="Ce mois-ci"     value={loading ? null : totalMois.toFixed(1)} unit="kWh"
                  icon={Calendar} gradient="linear-gradient(135deg,#f59e0b,#d97706)" loading={loading}
                  trendLabel={`${saisiesMois} saisie${saisiesMois !== 1 ? 's' : ''}`} />
        <StatCard label="Nb. appareils"  value={loading ? null : String(parAppareil?.length ?? 0)}
                  icon={Leaf} gradient="linear-gradient(135deg,#22c55e,#16a34a)" loading={loading}
                  trendLabel="avec données" />
      </div>

      {/* Graphique principal */}
      <div className="card-p mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-semibold text-ink">Évolution de la consommation</p>
            <p className="text-xs text-ink-3 mt-0.5">kWh · {PERIODS.find(p => p.value === period)?.label}</p>
          </div>
          <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-border">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                      className={clsx('tab-pill', period === p.value ? 'tab-pill-active' : 'tab-pill-inactive')}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading
          ? <div className="skeleton h-[210px] w-full" />
          : !chartData.length || chartData.every(d => d.total === 0)
            ? <Empty message="Pas de données pour cette période" icon={BarChart2} />
            : period === 'mois'
              ? <ConsommationBarChart data={chartData} />
              : <ConsommationAreaChart data={chartData} />
        }
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-3 gap-4">

        {/* Pie */}
        <div className="card-p">
          <p className="font-semibold text-ink mb-1">Répartition appareils</p>
          <p className="text-xs text-ink-3 mb-4">Part de la conso totale</p>
          {loading
            ? <div className="skeleton h-[210px] w-full" />
            : !parAppareil?.length
              ? <Empty message="Aucun appareil renseigné" />
              : <AppareilPieChart data={parAppareil} />
          }
        </div>

        {/* Barres de classement */}
        <div className="card-p">
          <div className="flex items-center gap-2 mb-5">
            <Award size={14} className="text-teal-500" />
            <p className="font-semibold text-ink text-sm">Classement appareils</p>
          </div>
          {loading
            ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-8 w-full" />)}</div>
            : !parAppareil?.length
              ? <Empty message="Aucune donnée" />
              : (() => {
                  const max = parseFloat(parAppareil[0]?.total_kwh) || 1
                  return (
                    <div className="space-y-3">
                      {parAppareil.slice(0, 7).map((a, i) => {
                        const val = parseFloat(a.total_kwh)
                        const pct = (val / max) * 100
                        const col = appareilChartColor(a.appareil)
                        return (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs text-ink-2 flex items-center gap-1.5">
                                {i === 0 && <Award size={10} className="text-amber-400" />}
                                {a.appareil || 'Non défini'}
                              </span>
                              <span className="text-xs font-bold font-mono" style={{ color: col }}>
                                {val.toFixed(1)} kWh
                              </span>
                            </div>
                            <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700"
                                   style={{ width: `${pct}%`, background: col }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()
          }
        </div>

        {/* Insights */}
        <div className="card-hero-p">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#14b8b8,#0e9b9b)', boxShadow: '0 2px 8px rgba(20,184,184,0.3)' }}>
              <Flame size={13} className="text-white" />
            </div>
            <p className="font-semibold text-sm text-ink">Insights</p>
          </div>

          {loading && <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 w-full" />)}</div>}

          {!loading && (
            <div className="space-y-3">
              {best && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown size={11} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Meilleure journée</span>
                  </div>
                  <p className="font-bold text-xl text-ink leading-none">
                    {parseFloat(best.kwh).toFixed(2)}<span className="text-xs font-normal text-ink-3 ml-1">kWh</span>
                  </p>
                  <p className="text-[11px] text-ink-3 mt-1 font-mono">
                    {fmtDate(best.date_mesure)}{best.appareil && ` · ${best.appareil}`}
                  </p>
                </div>
              )}

              {worst && worst.id !== best?.id && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame size={11} className="text-red-400" />
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Pic de conso</span>
                  </div>
                  <p className="font-bold text-xl text-ink leading-none">
                    {parseFloat(worst.kwh).toFixed(2)}<span className="text-xs font-normal text-ink-3 ml-1">kWh</span>
                  </p>
                  <p className="text-[11px] text-ink-3 mt-1 font-mono">
                    {fmtDate(worst.date_mesure)}{worst.appareil && ` · ${worst.appareil}`}
                  </p>
                </div>
              )}

              {data?.length > 0 && (
                <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                  <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider">Total saisies</span>
                  <p className="font-bold text-2xl text-teal-500 mt-1 leading-none">
                    {data.length}<span className="text-xs font-normal text-teal-400 ml-1">enregistrements</span>
                  </p>
                </div>
              )}

              {!data?.length && <p className="text-xs text-ink-3">Aucune donnée disponible.</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
