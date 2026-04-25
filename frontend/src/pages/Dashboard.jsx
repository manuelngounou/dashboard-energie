import { useState } from 'react'
import { Zap, TrendingUp, DollarSign, Plus, ArrowRight, Lightbulb, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { StatCard, Alert, Empty } from '../components/ui'
import { ConsommationAreaChart, AppareilPieChart } from '../components/charts'
import ConsommationForm from '../components/ui/ConsommationForm'
import { useConsommations, useStats } from '../hooks/useData'
import { fmtDate, last7Days, appareilColor, appareilChartColor } from '../utils/helpers'

export default function Dashboard() {
  const { data, loading: lC, error, refetch: rC } = useConsommations()
  const { totalKwh, moyenneKwh, parAppareil, loading: lS, refetch: rS } = useStats()
  const [formOpen, setFormOpen] = useState(false)

  const refetchAll = () => { rC(); rS() }
  const jours7    = last7Days(data ?? [])
  const recentes  = (data ?? []).slice(0, 6)
  const recs      = buildRecs(totalKwh, moyenneKwh, parAppareil)
  const tot       = parseFloat(totalKwh) || 0

  return (
    <Layout
      title="Dashboard"
      subtitle={`${(data ?? []).length} enregistrements · ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      actions={
        <button className="btn-primary" onClick={() => setFormOpen(true)}>
          <Plus size={14} /> Nouvelle saisie
        </button>
      }
    >
      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      {/* ── KPIs ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total consommé"
          value={tot ? tot.toFixed(1) : null} unit="kWh"
          icon={Zap}
          gradient="linear-gradient(135deg,#14b8b8,#0e9b9b)"
          loading={lS}
          trendLabel="toutes données confondues"
        />
        <StatCard
          label="Moyenne / saisie"
          value={moyenneKwh ? parseFloat(moyenneKwh).toFixed(2) : null} unit="kWh"
          icon={TrendingUp}
          gradient="linear-gradient(135deg,#8b5cf6,#7c3aed)"
          loading={lS}
          trendLabel="par enregistrement"
        />
        <StatCard
          label="Coût estimé"
          value={tot ? (tot * 0.2516).toFixed(2) : null} unit="€"
          icon={DollarSign}
          gradient="linear-gradient(135deg,#f59e0b,#d97706)"
          loading={lS}
          trendLabel="@ 0.2516 €/kWh · EDF"
        />
      </div>

      {/* ── Graphiques ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* Area 7j */}
        <div className="col-span-2 card-p">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-ink">7 derniers jours</p>
              <p className="text-xs text-ink-3 mt-0.5">Consommation quotidienne · kWh</p>
            </div>
            <Link to="/statistiques"
                  className="flex items-center gap-1 text-xs font-semibold text-teal-500 hover:text-teal-600 transition-colors">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          {lC
            ? <div className="skeleton h-[210px] w-full" />
            : jours7.every(d => d.total === 0)
              ? <Empty message="Aucune saisie sur les 7 derniers jours" icon={Zap} />
              : <ConsommationAreaChart data={jours7} />
          }
        </div>

        {/* Pie */}
        <div className="card-p">
          <p className="font-semibold text-ink mb-1">Par appareil</p>
          <p className="text-xs text-ink-3 mb-4">Répartition de la conso totale</p>
          {lS
            ? <div className="skeleton h-[210px] w-full" />
            : !parAppareil?.length
              ? <Empty message="Aucun appareil renseigné" />
              : <AppareilPieChart data={parAppareil} />
          }
        </div>
      </div>

      {/* ── Bottom ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Tableau récent */}
        <div className="col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <p className="font-semibold text-ink text-sm">Saisies récentes</p>
            <Link to="/consommations"
                  className="flex items-center gap-1 text-xs font-semibold text-teal-500 hover:text-teal-600 transition-colors">
              Tout voir <ArrowRight size={12} />
            </Link>
          </div>

          {lC
            ? <div className="p-5 space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 w-full" />)}</div>
            : !recentes.length
              ? <Empty message="Aucune saisie" icon={Zap}
                       action={<button className="btn-primary" onClick={() => setFormOpen(true)}><Plus size={13} /> Première saisie</button>} />
              : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-2/60">
                      {['Date', 'kWh', 'Appareil', 'Note'].map(h => (
                        <th key={h} className="text-left px-5 py-2.5 section-ttl">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentes.map(c => {
                      const col = appareilColor(c.appareil)
                      return (
                        <tr key={c.id} className="border-b border-border/50 hover:bg-surface-2/60 transition-colors">
                          <td className="px-5 py-3 text-ink-2 text-xs font-mono">{fmtDate(c.date_mesure, 'd MMM yy')}</td>
                          <td className="px-5 py-3">
                            <span className="font-bold text-teal-500">{parseFloat(c.kwh).toFixed(2)}</span>
                            <span className="text-ink-3 text-xs ml-1">kWh</span>
                          </td>
                          <td className="px-5 py-3">
                            {c.appareil
                              ? <span className="badge text-xs px-2 py-0.5 rounded-full font-semibold"
                                      style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
                                  {c.appareil}
                                </span>
                              : <span className="text-ink-4">—</span>
                            }
                          </td>
                          <td className="px-5 py-3 text-ink-3 text-xs">
                            <span className="block truncate max-w-[160px]">{c.commentaire || '—'}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )
          }
        </div>

        {/* Recommandations */}
        <div className="card-p">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
              <Lightbulb size={13} className="text-teal-500" />
            </div>
            <p className="font-semibold text-sm text-ink">Conseils</p>
          </div>
          {!recs.length
            ? <p className="text-xs text-ink-3">Ajoutez des données pour obtenir des conseils personnalisés.</p>
            : <div className="space-y-2.5">
                {recs.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg border"
                       style={{ background: r.bg, borderColor: r.border }}>
                    <div className="flex items-start gap-2">
                      <r.Icon size={13} style={{ color: r.color, marginTop: 1, flexShrink: 0 }} />
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: r.color }}>{r.titre}</p>
                        <p className="text-xs text-ink-2 leading-relaxed">{r.texte}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      <ConsommationForm open={formOpen} onClose={() => setFormOpen(false)} onSaved={refetchAll} />
    </Layout>
  )
}

function buildRecs(total, moyenne, parAppareil) {
  const recs = []
  const moy = parseFloat(moyenne) || 0
  const tot = parseFloat(total)   || 0

  if (moy > 20) recs.push({
    Icon: AlertTriangle, titre: 'Consommation élevée',
    texte: `Votre moyenne de ${moy.toFixed(1)} kWh/saisie dépasse le seuil de 20 kWh.`,
    color: '#ef4444', bg: '#fef2f2', border: '#fecaca',
  })
  if (moy > 0 && moy <= 10) recs.push({
    Icon: CheckCircle2, titre: 'Bonne maîtrise !',
    texte: `Excellente moyenne de ${moy.toFixed(1)} kWh/saisie. Continuez ainsi.`,
    color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
  })
  if (parAppareil?.length) {
    const top = parAppareil[0]
    if (top && parseFloat(top.total_kwh) > tot * 0.5) recs.push({
      Icon: AlertTriangle, titre: `${top.appareil || 'Appareil'} dominant`,
      texte: `Représente plus de 50% de votre consommation. Optimisez son usage.`,
      color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    })
  }
  if (!recs.length && tot > 0) recs.push({
    Icon: Info, titre: 'Analysez vos tendances',
    texte: 'Consultez la page Statistiques pour suivre votre évolution mensuelle.',
    color: '#0e9b9b', bg: '#f0fafa', border: '#99ebeb',
  })
  return recs
}
