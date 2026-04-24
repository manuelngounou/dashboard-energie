import { X, AlertCircle, CheckCircle2, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

// ── StatCard ──────────────────────────────────────────────────────────────
export function StatCard({ label, value, unit, icon: Icon, color = 'green', trend, trendLabel, className, loading }) {
  const palette = {
    green:  { icon: 'text-accent-green  bg-accent-green/10  border-accent-green/25',  val: 'text-ink'          },
    blue:   { icon: 'text-accent-blue   bg-accent-blue/10   border-accent-blue/25',   val: 'text-ink'          },
    orange: { icon: 'text-accent-orange bg-accent-orange/10 border-accent-orange/25', val: 'text-ink'          },
    red:    { icon: 'text-accent-red    bg-accent-red/10    border-accent-red/25',     val: 'text-accent-red'   },
    yellow: { icon: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/25', val: 'text-ink'          },
  }
  const p = palette[color] || palette.green

  if (loading) {
    return (
      <div className={clsx('card-p', className)}>
        <div className="skeleton h-3 w-24 mb-4" />
        <div className="skeleton h-8 w-32 mb-2" />
        <div className="skeleton h-3 w-16" />
      </div>
    )
  }

  return (
    <div className={clsx('card-p flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-ink-2 uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center border', p.icon)}>
            <Icon size={14} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className={clsx('font-display font-bold text-[2rem] leading-none', p.val)}>
          {value ?? '—'}
        </span>
        {unit && <span className="text-sm text-ink-3 mb-0.5">{unit}</span>}
      </div>

      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center gap-1.5">
          {trend !== undefined && (
            trend > 2
              ? <TrendingUp  size={12} className="text-accent-red" />
              : trend < -2
                ? <TrendingDown size={12} className="text-accent-green" />
                : <Minus size={12} className="text-ink-3" />
          )}
          {trendLabel && <span className="text-xs text-ink-3">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const w = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div
        className={clsx('relative bg-surface-1 border border-white/[0.08] rounded-2xl shadow-modal w-full animate-fade-up', w[size])}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="section-ttl">{title}</h2>
          <button onClick={onClose} className="btn-icon"><X size={13} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────
export function Spinner({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         className={clsx('animate-spin', className ?? 'text-accent-green')}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
              strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" opacity=".25" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
              strokeDasharray="9"  strokeDashoffset="0"  strokeLinecap="round" />
    </svg>
  )
}

// ── Empty ─────────────────────────────────────────────────────────────────
export function Empty({ message = 'Aucune donnée', icon: Icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {Icon && <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mb-1">
        <Icon size={20} className="text-ink-3" />
      </div>}
      <p className="text-ink-2 text-sm">{message}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

// ── Alert ──────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', title, children, onClose }) {
  const map = {
    info:    { Icon: Info,         cls: 'bg-accent-blue/8   border-accent-blue/20   text-accent-blue'   },
    success: { Icon: CheckCircle2, cls: 'bg-accent-green/8  border-accent-green/20  text-accent-green'  },
    error:   { Icon: AlertCircle,  cls: 'bg-accent-red/8    border-accent-red/20    text-accent-red'    },
    warning: { Icon: AlertCircle,  cls: 'bg-accent-yellow/8 border-accent-yellow/20 text-accent-yellow' },
  }
  const { Icon, cls } = map[type] || map.info
  return (
    <div className={clsx('flex gap-3 p-4 rounded-xl border', cls)}>
      <Icon size={15} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        <p className="text-sm opacity-85">{children}</p>
      </div>
      {onClose && <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100"><X size={13} /></button>}
    </div>
  )
}

// ── FormField ─────────────────────────────────────────────────────────────
export function FormField({ label, error, hint, children, required }) {
  return (
    <div>
      {label && (
        <label className="field-label">
          {label}{required && <span className="text-accent-red ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint  && !error && <p className="text-xs text-ink-3 mt-1">{hint}</p>}
      {error && <p className="text-xs text-accent-red mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────
export function Table({ columns, data, onRowClick, emptyMessage, loading, emptyIcon }) {
  if (loading) return <div className="space-y-2 p-4">{[...Array(5)].map((_,i)=><div key={i} className="skeleton h-11 w-full" style={{opacity: 1-i*.15}} />)}</div>
  if (!data?.length) return <Empty message={emptyMessage} icon={emptyIcon} />
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map(col => (
              <th key={col.key} className={clsx('text-left px-4 py-3 text-[11px] text-ink-3 font-semibold uppercase tracking-widest', col.cls)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={clsx(
                'border-b border-white/[0.04] transition-colors',
                onRowClick ? 'cursor-pointer hover:bg-surface-2/60' : ''
              )}
            >
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

// ── ConfirmDialog ─────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-ink-2 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-ghost" onClick={onClose} disabled={loading}>Annuler</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner size={15} /> : null}
          Supprimer
        </button>
      </div>
    </Modal>
  )
}
