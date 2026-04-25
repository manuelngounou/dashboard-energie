import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Zap, BarChart2, Leaf } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/consommations', icon: Zap,             label: 'Consommations' },
  { to: '/statistiques',  icon: BarChart2,        label: 'Statistiques'  },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-56 flex flex-col z-40 bg-surface border-r border-border">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center animate-pulse-teal"
               style={{ background: 'linear-gradient(135deg,#14b8b8,#0e9b9b)', boxShadow: '0 4px 12px rgba(20,184,184,0.35)' }}>
            <Leaf size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-sm text-ink leading-tight tracking-tight">
              Énergie<span className="text-teal-500">Track</span>
            </p>
            <p className="text-[11px] text-ink-3 mt-0.5">Dashboard v4.0</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="section-ttl px-3 pt-3 pb-2">Menu</p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-teal-50 text-teal-600 border border-teal-100'
                : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
            )}
          >
            {({ isActive }) => (<>
              <Icon size={15} className={clsx('flex-shrink-0', isActive ? 'text-teal-500' : '')} />
              <span className="flex-1">{label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />}
            </>)}
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-border">
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0 animate-pulse" />
            <span className="text-xs font-semibold text-teal-600">Backend connecté</span>
          </div>
          <p className="text-[11px] text-teal-400 font-mono">PHP · PostgreSQL</p>
        </div>
      </div>
    </aside>
  )
}
