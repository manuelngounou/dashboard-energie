import { useState } from 'react'
import { Zap, TrendingUp, BarChart2, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { StatCard, Alert, Empty } from '../components/ui'
import { ConsommationAreaChart, AppareilPieChart, SparkBar } from '../components/charts'
import ConsommationForm from '../components/ui/ConsommationForm'
import { useConsommations, useStats } from '../hooks/useData'
import { fmtDate, fmtKwh, fmtEuros, last7Days, groupByMonth, appareilColor } from '../utils/helpers'

export default function Dashboard() {
  const { data: conso,  loading: loadConso, error: errConso, refetch: refConso } = useConsommations()
  const { totalKwh, moyenneKwh, parAppareil, loading: loadStats, refetch: refStats } = useStats()
  const [formOpen, setFormOpen] = useState(false)

  function refetchAll() { refConso(); refStats() }

  const jours7  = last7Days(conso ?? [])
  const moisData = groupByMonth(conso ?? [])

  // 5 dernières saisies
  const recentes = (conso ?? []).slice(0, 5)

  // Recommandations simples basées sur les données
  const recommandations = buildRecommandations(totalKwh, moyenneKwh, parAppareil)

  return (
    <Layout
      title="Vue d'ensemble"
      subtitle="Suivi de votre consommation électrique"
      actions={
        <button className="btn-primary" onClick={() => setFormOpen(true)}>
          <Plus size={14} /> Nouvelle saisie
        </button>
      }
    >
      {errConso && <Alert type="error" className="mb-5">Impossible de charger les données : {errConso}</Alert>}

      {/* ── KPI row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total consommé"
          value={totalKwh ? parseFloat(totalKwh).toFixed(1) : null}
          unit="kWh"
          icon={Zap}
          color="green"
          loading={loadStats}
          trendLabel="toutes données confondues"
        />
        <StatCard
          label="Moyenne / saisie"
          value={moyenneKwh ? parseFloat(moyenneKwh).toFixed(2) : null}
          unit="kWh"
          icon={TrendingUp}
          color="blue"
          loading={loadStats}
          trendLabel="par enregistrement"
        />
        <StatCard
          label="Coût estimé"
          value={totalKwh ? (parseFloat(totalKwh) * 0.2516).toFixed(2) : null}
          unit="€"
          icon={BarChart2}
          color="yellow"
          loading={loadStats}
          trendLabel="@ 0.2516 €/kWh (EDF)"
        />
      </div>

      {/* ── Charts row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Area chart 7 jours */}
        <div className="col-span-2 card-p">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-ttl">7 derniers jours</p>
              <p className="text-xs text-ink-3 mt-0.5">Consommation quotidienne (kWh)</p>
            </div>
            <Link to="/statistiques" className="text-xs text-accent-green hover:text-accent-green-l flex items-center gap-1 transition-colors">
              Voir tout <ArrowRight size={11} />
            </Link>
          </div>
          {loadConso
            ? <div className="skeleton h-[220px] w-full" />
            : jours7.every(d => d.total === 0)
              ? <Empty message="Pas de données sur les 7 derniers jours" />
              : <ConsommationAreaChart data={jours7} />
          }
        </div>

        {/* Pie chart appareils */}
        <div className="card-p">
          <div className="mb-4">
            <p className="section-ttl">Par appareil</p>
            <p className="text-xs text-ink-3 mt-0.5">Répartition totale</p>
          </div>
          {loadStats
            ? <div className="skeleton h-[220px] w-full" />
            : !parAppareil?.length
              ? <Empty message="Aucune donnée appareil" />
              : <AppareilPieChart data={parAppareil} />
          }
        </div>
      </div>

      {/* ── Bottom row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Saisies récentes */}
        <div className="col-span-2 card-p">
          <div className="flex items-center justify-between mb-4">
            <p className="section-ttl">Saisies récentes</p>
            <Link to="/consommations" className="text-xs text-accent-green hover:text-accent-green-l flex items-center gap-1 transition-colors">
              Tout voir <ArrowRight size={11} />
            </Link>
          </div>
          {loadConso
            ? <div className="space-y-2">{[...Array(4)].map((_,i)=><div key={i} className="skeleton h-10 w-full" style={{opacity:1-i*.2}}/>)}</div>
            : recentes.length === 0
              ? <Empty message="Aucune saisie pour l'instant" action={
                  <button className="btn-primary mt-2" onClick={() => setFormOpen(true)}>
                    <Plus size={13} /> Première saisie
                  </button>
                } />
              : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {['Date','kWh','Appareil','Commentaire'].map(h=>(
                        <th key={h} className="text-left px-3 py-2 text-[11px] text-ink-3 font-semibold uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentes.map((c, i) => (
                      <tr key={c.id} className="border-b border-white/[0.03] hover:bg-surface-2/50 transition-colors"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                        <td className="px-3 py-2.5 text-ink font-mono text-xs">{fmtDate(c.date_mesure, 'd MMM yy')}</td>
                        <td className="px-3 py-2.5">
                          <span className="font-display font-semibold text-accent-green">{parseFloat(c.kwh).toFixed(2)}</span>
                          <span className="text-ink-3 text-xs ml-1">kWh</span>
                        </td>
                        <td className="px-3 py-2.5">
                          {c.appareil
                            ? <span className="badge" style={{ color: appareilColor(c.appareil), background: `${appareilColor(c.appareil)}18`, border: `1px solid ${appareilColor(c.appareil)}30` }}>{c.appareil}</span>
                            : <span className="text-ink-4 text-xs">—</span>
                          }
                        </td>
                        <td className="px-3 py-2.5 text-ink-3 text-xs truncate max-w-[160px]">{c.commentaire || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
          }
        </div>

        {/* Recommandations */}
        <div className="card-p">
          <p className="section-ttl mb-4">Recommandations</p>
          {recommandations.length === 0
            ? <p className="text-xs text-ink-3">Ajoutez des données pour obtenir des conseils personnalisés.</p>
            : (
              <div className="space-y-3">
                {recommandations.map((r, i) => (
                  <div key={i} className={`p-3 rounded-xl border text-xs ${r.color}`}>
                    <p className="font-semibold mb-0.5">{r.titre}</p>
                    <p className="opacity-80 leading-relaxed">{r.texte}</p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      <ConsommationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={refetchAll}
      />
    </Layout>
  )
}

/* ── Moteur de recommandations simples ───────────────────────────────── */
function buildRecommandations(total, moyenne, parAppareil) {
  const recs = []
  const moy  = parseFloat(moyenne) || 0
  const tot  = parseFloat(total)   || 0

  if (moy > 20) recs.push({
    titre: '⚠️ Consommation élevée',
    texte: `Votre moyenne de ${moy.toFixed(1)} kWh/saisie est au-dessus du seuil recommandé de 20 kWh.`,
    color: 'bg-accent-red/8 border-accent-red/20 text-accent-red',
  })
  else if (moy > 0 && moy <= 10) recs.push({
    titre: '✅ Bonne maîtrise',
    texte: `Excellente moyenne de ${moy.toFixed(1)} kWh/saisie. Continuez ainsi !`,
    color: 'bg-accent-green/8 border-accent-green/20 text-accent-green',
  })

  if (parAppareil?.length) {
    const top = parAppareil[0]
    if (top && parseFloat(top.total_kwh) > tot * 0.5) recs.push({
      titre: `💡 ${top.appareil || 'Appareil'} dominant`,
      texte: `Représente plus de 50% de votre consommation totale. Pensez à optimiser son usage.`,
      color: 'bg-accent-orange/8 border-accent-orange/20 text-accent-orange',
    })
  }

  if (tot > 0 && tot < 50) recs.push({
    titre: '📊 Données insuffisantes',
    texte: 'Continuez vos saisies pour obtenir des analyses plus précises et des tendances fiables.',
    color: 'bg-accent-blue/8 border-accent-blue/20 text-accent-blue',
  })

  if (!recs.length && tot > 0) recs.push({
    titre: '📈 Suivez vos tendances',
    texte: 'Comparez vos consommations mensuelles dans la page Statistiques pour détecter les pics.',
    color: 'bg-surface-3 border-white/[0.08] text-ink-2',
  })

  return recs
}
