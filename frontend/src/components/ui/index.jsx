import { X, AlertCircle, CheckCircle2, Info, TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

/* ── StatCard ─────────────────────────────────────────────────────────── */
export function StatCard({ label, value, unit, icon: Icon, gradient, trendLabel, loading, className }) {
  if (loading) return (
    <div className={clsx('card-p', className)}>
      <div className="skeleton h-3 w-24 mb-4" />
      <div className="skeleton h-8 w-32 mb-2" />
      <div className="skeleton h-3 w-20" />
    </div>
  )

  return (
    <div className={clsx('card-p group hover:shadow-md transition-shadow duration-200', className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="section-ttl">{label}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ background: gradient || 'linear-gradient(135deg,#14b8b8,#0e9b9b)', boxShadow: '0 2px 8px rgba(20,184,184,0.25)' }}>
            <Icon size={15} className="text-white" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="stat-val">{value ?? '—'}</span>
        {unit && <span className="text-sm text-ink-3 font-medium">{unit}</span>}
      </div>

      {trendLabel && (
        <p className="text-xs text-ink-3">{trendLabel}</p>
      )}
    </div>
  )
}

/* ── Modal ────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const w = { sm: 460, md: 540, lg: 660 }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative bg-surface border border-border rounded-xl w-full animate-scale-in"
        style={{ maxWidth: w[size], boxShadow: '0 20px 60px rgba(0,80,80,0.18), 0 4px 16px rgba(0,0,0,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Bande teal en haut */}
        <div className="h-1 rounded-t-xl" style={{ background: 'linear-gradient(90deg,#14b8b8,#8b5cf6)' }} />
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-base text-ink">{title}</h2>
          <button className="btn-icon" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

/* ── Spinner ──────────────────────────────────────────────────────────── */
export function Spinner({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         className={clsx('animate-spin text-teal-500', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
              strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" opacity=".2" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
              strokeDasharray="9" strokeLinecap="round" />
    </svg>
  )
}

/* ── Empty ────────────────────────────────────────────────────────────── */
export function Empty({ message = 'Aucune donnée', icon: Icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-1">
          <Icon size={20} className="text-teal-300" />
        </div>
      )}
      <p className="text-sm text-ink-3">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/* ── Alert ────────────────────────────────────────────────────────────── */
export function Alert({ type = 'info', title, children, onClose }) {
  const styles = {
    info:    { Icon: Info,         cls: 'bg-teal-50 border-teal-200 text-teal-700'       },
    success: { Icon: CheckCircle2, cls: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    error:   { Icon: AlertCircle,  cls: 'bg-red-50 border-red-200 text-red-700'         },
    warning: { Icon: AlertCircle,  cls: 'bg-amber-50 border-amber-200 text-amber-700'   },
  }
  const { Icon, cls } = styles[type] || styles.info
  return (
    <div className={clsx('flex gap-3 p-4 rounded-lg border', cls)}>
      <Icon size={15} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        <p className="text-sm opacity-85">{children}</p>
      </div>
      {onClose && <button onClick={onClose} className="opacity-50 hover:opacity-100"><X size={13} /></button>}
    </div>
  )
}

/* ── FormField ────────────────────────────────────────────────────────── */
export function FormField({ label, error, hint, children, required }) {
  return (
    <div>
      {label && (
        <label className="field-label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint  && !error && <p className="text-xs text-ink-3 mt-1">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  )
}

/* ── Table ────────────────────────────────────────────────────────────── */
export function Table({ columns, data, loading, emptyMessage, emptyIcon, onRowClick }) {
  if (loading) return (
    <div className="space-y-2 p-5">
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-11 w-full" style={{ opacity: 1 - i * 0.15 }} />)}
    </div>
  )
  if (!data?.length) return <Empty message={emptyMessage} icon={emptyIcon} />
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map(col => (
              <th key={col.key} className={clsx('text-left px-4 py-3 section-ttl', col.cls)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'border-b border-border/60 transition-colors',
                  onRowClick ? 'cursor-pointer hover:bg-surface-2' : 'hover:bg-surface-2/50'
                )}>
              {columns.map(col => (
                <td key={col.key} className={clsx('px-4 py-3 text-ink', col.cls)}>
                  {col.render ? col.render(row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── ConfirmDialog ────────────────────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-ink-2 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-ghost" onClick={onClose} disabled={loading}>Annuler</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner size={14} />} Supprimer
        </button>
      </div>
    </Modal>
  )
}
