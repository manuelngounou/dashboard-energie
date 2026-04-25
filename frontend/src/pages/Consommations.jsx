import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, Zap, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { Table, ConfirmDialog, Alert } from '../components/ui'
import ConsommationForm from '../components/ui/ConsommationForm'
import { useConsommations, useStats } from '../hooks/useData'
import { consommationApi } from '../services/api'
import { fmtDate, appareilColor } from '../utils/helpers'
import clsx from 'clsx'

export default function Consommations() {
  const { data, loading, error, refetch }   = useConsommations()
  const { refetch: rS }                     = useStats()
  const [search,   setSearch]   = useState('')
  const [appFilt,  setAppFilt]  = useState('')
  const [sortKey,  setSortKey]  = useState('date_mesure')
  const [sortDir,  setSortDir]  = useState('desc')
  const [formOpen, setFormOpen] = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [delId,    setDelId]    = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast,    setToast]    = useState(null)

  const refetchAll = () => { refetch(); rS() }
  const showToast  = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const appareils = useMemo(() => [...new Set((data ?? []).map(c => c.appareil).filter(Boolean))].sort(), [data])

  const filtered = useMemo(() => {
    let rows = [...(data ?? [])]
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
      return sortDir === 'asc' ? (va < vb ? -1 : va > vb ? 1 : 0) : (va > vb ? -1 : va < vb ? 1 : 0)
    })
    return rows
  }, [data, search, appFilt, sortKey, sortDir])

  function toggleSort(k) {
    sortKey === k ? setSortDir(d => d === 'asc' ? 'desc' : 'asc') : (setSortKey(k), setSortDir('desc'))
  }

  async function handleDelete() {
    setDeleting(true)
    try { await consommationApi.delete(delId); setDelId(null); showToast('Saisie supprimée'); refetchAll() }
    catch (e) { showToast(e.message, 'error') }
    finally { setDeleting(false) }
  }

  function SortBtn({ col, children }) {
    const active = sortKey === col
    return (
      <button onClick={() => toggleSort(col)}
              className="flex items-center gap-1 hover:text-teal-500 transition-colors">
        {children}
        {active
          ? sortDir === 'asc'
            ? <ChevronUp   size={11} className="text-teal-500" />
            : <ChevronDown size={11} className="text-teal-500" />
          : <ChevronDown size={11} className="opacity-30" />
        }
      </button>
    )
  }

  const columns = [
    {
      key: 'date_mesure',
      label: <SortBtn col="date_mesure">Date</SortBtn>,
      render: c => <span className="text-ink-2 text-xs font-mono">{fmtDate(c.date_mesure, 'd MMM yyyy')}</span>,
    },
    {
      key: 'kwh',
      label: <SortBtn col="kwh">kWh</SortBtn>,
      render: c => (
        <span>
          <span className="font-bold text-teal-500">{parseFloat(c.kwh).toFixed(2)}</span>
          <span className="text-ink-3 text-xs ml-1">kWh</span>
        </span>
      ),
    },
    {
      key: 'appareil',
      label: 'Appareil',
      render: c => {
        if (!c.appareil) return <span className="text-ink-4">—</span>
        const col = appareilColor(c.appareil)
        return (
          <span className="badge text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
            {c.appareil}
          </span>
        )
      },
    },
    {
      key: 'commentaire',
      label: 'Commentaire',
      render: c => <span className="text-ink-3 text-xs block truncate max-w-[180px]">{c.commentaire || '—'}</span>,
    },
    {
      key: '_actions', label: '', cls: 'w-20',
      render: c => (
        <div className="flex items-center gap-1.5 justify-end">
          <button className="btn-icon p-1.5" onClick={e => { e.stopPropagation(); setEditing(c); setFormOpen(true) }}>
            <Pencil size={12} />
          </button>
          <button className="p-1.5 rounded-md border transition-all duration-150 cursor-pointer"
                  style={{ background: 'rgba(239,68,68,0.06)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                  onClick={e => { e.stopPropagation(); setDelId(c.id) }}>
            <Trash2 size={12} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <Layout
      title="Consommations"
      subtitle={`${filtered.length} résultat${filtered.length !== 1 ? 's' : ''}`}
      actions={
        <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus size={14} /> Nouvelle saisie
        </button>
      }
    >
      {/* Toast */}
      {toast && (
        <div className={clsx(
          'fixed bottom-6 right-6 z-50 animate-fade-up px-4 py-3 rounded-lg border text-sm font-semibold shadow-md',
          toast.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-teal-50 border-teal-200 text-teal-600'
        )}>
          {toast.msg}
        </div>
      )}

      {error && <Alert type="error" className="mb-5">{error}</Alert>}

      {/* Filtres */}
      <div className="card-p mb-5 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
          <input type="text" className="field-input pl-9" placeholder="Rechercher…"
                 value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-ink-3 flex-shrink-0" />
          <select className="field-input w-auto" value={appFilt} onChange={e => setAppFilt(e.target.value)}>
            <option value="">Tous les appareils</option>
            {appareils.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        {(search || appFilt) && (
          <button className="btn-ghost text-xs" onClick={() => { setSearch(''); setAppFilt('') }}>
            Effacer
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <Table columns={columns} data={filtered} loading={loading} emptyIcon={Zap}
               emptyMessage={search || appFilt ? 'Aucun résultat pour ces filtres' : 'Aucune saisie — ajoutez votre première consommation'} />
      </div>

      {filtered.length > 0 && !loading && (
        <p className="text-right mt-3 text-xs text-ink-3">
          Total affiché :{' '}
          <span className="font-bold text-teal-500 font-mono">
            {filtered.reduce((s, c) => s + parseFloat(c.kwh || 0), 0).toFixed(2)} kWh
          </span>
        </p>
      )}

      <ConsommationForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }}
                        onSaved={() => { refetchAll(); showToast(editing ? 'Saisie modifiée' : 'Saisie ajoutée') }}
                        initial={editing} />
      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={handleDelete}
                     loading={deleting} title="Supprimer la saisie"
                     message="Cette action est irréversible. La saisie sera définitivement supprimée." />
    </Layout>
  )
}
