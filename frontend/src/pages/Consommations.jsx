import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, Zap, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { Table, ConfirmDialog, Alert, Empty } from '../components/ui'
import ConsommationForm from '../components/ui/ConsommationForm'
import { useConsommations, useStats } from '../hooks/useData'
import { consommationApi } from '../services/api'
import { fmtDate, fmtKwh, appareilColor } from '../utils/helpers'

export default function Consommations() {
  const { data, loading, error, refetch } = useConsommations()
  const { refetch: refStats } = useStats()

  const [search,  setSearch]  = useState('')
  const [appFilt, setAppFilt] = useState('')
  const [sortKey, setSortKey] = useState('date_mesure')
  const [sortDir, setSortDir] = useState('desc')
  const [formOpen, setFormOpen]       = useState(false)
  const [editing,  setEditing]        = useState(null)
  const [delId,    setDelId]          = useState(null)
  const [deleting, setDeleting]       = useState(false)
  const [toast,    setToast]          = useState(null)

  function refetchAll() { refetch(); refStats() }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── Filtres & tri ───────────────────────────────────────────────── */
  const appareils = useMemo(() => {
    if (!data) return []
    return [...new Set(data.map(c => c.appareil).filter(Boolean))].sort()
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    let rows = [...data]

    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(c =>
        c.appareil?.toLowerCase().includes(q) ||
        c.commentaire?.toLowerCase().includes(q) ||
        c.date_mesure?.includes(q) ||
        String(c.kwh).includes(q)
      )
    }
    if (appFilt) rows = rows.filter(c => c.appareil === appFilt)

    rows.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey]
      if (sortKey === 'kwh') { va = parseFloat(va); vb = parseFloat(vb) }
      if (va < vb) return sortDir === 'asc' ? -1 :  1
      if (va > vb) return sortDir === 'asc' ?  1 : -1
      return 0
    })
    return rows
  }, [data, search, appFilt, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  /* ── Suppression ─────────────────────────────────────────────────── */
  async function handleDelete() {
    setDeleting(true)
    try {
      await consommationApi.delete(delId)
      setDelId(null)
      showToast('Saisie supprimée avec succès')
      refetchAll()
    } catch (e) {
      showToast(e.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  /* ── Colonnes table ──────────────────────────────────────────────── */
  function SortIcon({ col }) {
    if (sortKey !== col) return <ChevronDown size={11} className="text-ink-4 ml-1 inline" />
    return sortDir === 'asc'
      ? <ChevronUp   size={11} className="text-accent-green ml-1 inline" />
      : <ChevronDown size={11} className="text-accent-green ml-1 inline" />
  }

  const columns = [
    {
      key: 'date_mesure', label: (
        <button className="flex items-center" onClick={() => toggleSort('date_mesure')}>
          Date <SortIcon col="date_mesure" />
        </button>
      ),
      render: c => <span className="font-mono text-xs text-ink-2">{fmtDate(c.date_mesure, 'd MMM yyyy')}</span>
    },
    {
      key: 'kwh', label: (
        <button className="flex items-center" onClick={() => toggleSort('kwh')}>
          kWh <SortIcon col="kwh" />
        </button>
      ),
      render: c => (
        <span className="font-display font-bold text-accent-green">
          {parseFloat(c.kwh).toFixed(2)}
          <span className="font-sans font-normal text-ink-3 text-xs ml-1">kWh</span>
        </span>
      )
    },
    {
      key: 'appareil', label: 'Appareil',
      render: c => c.appareil
        ? <span className="badge" style={{ color: appareilColor(c.appareil), background: `${appareilColor(c.appareil)}15`, borderColor: `${appareilColor(c.appareil)}30` }}>{c.appareil}</span>
        : <span className="text-ink-4 text-xs">—</span>
    },
    {
      key: 'commentaire', label: 'Commentaire',
      render: c => <span className="text-ink-3 text-xs truncate block max-w-[200px]">{c.commentaire || '—'}</span>
    },
    {
      key: 'created_at', label: 'Créé le',
      render: c => <span className="text-ink-4 text-xs font-mono">{fmtDate(c.created_at, 'd MMM yy')}</span>
    },
    {
      key: '_actions', label: '',
      cls: 'w-20',
      render: c => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            className="btn-icon p-1.5"
            title="Modifier"
            onClick={e => { e.stopPropagation(); setEditing(c); setFormOpen(true) }}
          >
            <Pencil size={12} />
          </button>
          <button
            className="p-1.5 rounded-lg bg-accent-red/8 text-accent-red border border-accent-red/15 hover:bg-accent-red/18 transition-colors"
            title="Supprimer"
            onClick={e => { e.stopPropagation(); setDelId(c.id) }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      )
    },
  ]

  return (
    <Layout
      title="Consommations"
      subtitle={`${filtered.length} enregistrement${filtered.length !== 1 ? 's' : ''}`}
      actions={
        <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus size={14} /> Nouvelle saisie
        </button>
      }
    >
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 animate-fade-up px-4 py-3 rounded-xl border text-sm font-medium shadow-modal
          ${toast.type === 'error'
            ? 'bg-accent-red/10 border-accent-red/25 text-accent-red'
            : 'bg-accent-green/10 border-accent-green/25 text-accent-green'}`}>
          {toast.msg}
        </div>
      )}

      {error && <Alert type="error" className="mb-5">Erreur chargement : {error}</Alert>}

      {/* ── Filtres ─────────────────────────────────────────────────── */}
      <div className="card-p mb-5 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
          <input
            type="text"
            className="field-input pl-9"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-ink-3 flex-shrink-0" />
          <select
            className="field-input w-auto"
            value={appFilt}
            onChange={e => setAppFilt(e.target.value)}
          >
            <option value="">Tous les appareils</option>
            {appareils.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {(search || appFilt) && (
          <button
            className="btn-ghost text-xs"
            onClick={() => { setSearch(''); setAppFilt('') }}
          >
            Effacer filtres
          </button>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage={search || appFilt ? 'Aucun résultat pour ces filtres' : 'Aucune saisie — ajoutez votre première consommation'}
          emptyIcon={Zap}
        />
      </div>

      {/* Total filtré */}
      {filtered.length > 0 && !loading && (
        <div className="mt-3 text-right">
          <span className="text-xs text-ink-3">
            Total affiché :{' '}
            <span className="font-mono text-accent-green font-semibold">
              {filtered.reduce((s, c) => s + parseFloat(c.kwh || 0), 0).toFixed(2)} kWh
            </span>
          </span>
        </div>
      )}

      {/* Modals */}
      <ConsommationForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSaved={() => { refetchAll(); showToast(editing ? 'Saisie modifiée' : 'Saisie ajoutée') }}
        initial={editing}
      />

      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Supprimer la saisie"
        message="Cette action est irréversible. La saisie sera définitivement supprimée."
      />
    </Layout>
  )
}
