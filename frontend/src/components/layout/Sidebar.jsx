import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Zap, BarChart2, Activity } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/',              icon: LayoutDashboard, label: 'Vue d\'ensemble' },
  { to: '/consommations', icon: Zap,             label: 'Consommations'  },
  { to: '/statistiques',  icon: BarChart2,        label: 'Statistiques'   },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-surface-1 border-r border-white/[0.06] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-green/10 border border-accent-green/25 flex items-center justify-center animate-glow-pulse">
            <Activity size={15} className="text-accent-green" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-ink leading-none">ÉnergieTrack</p>
            <p className="text-[11px] text-ink-3 mt-0.5">Dashboard personnel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-4">Navigation</p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group',
              isActive
                ? 'bg-accent-green/10 text-accent-green border border-accent-green/20 font-medium'
                : 'text-ink-2 hover:text-ink hover:bg-surface-3'
            )}
          >
            {({ isActive }) => (<>
              <Icon size={15} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" />}
            </>)}
          </NavLink>
        ))}
      </nav>

      {/* Status indicator */}
      <div className="px-4 pb-5">
        <div className="bg-surface-2 border border-white/[0.06] rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow flex-shrink-0" />
            <span className="text-xs font-medium text-ink-2">Backend PHP actif</span>
          </div>
          <p className="text-[11px] text-ink-3 font-mono">:5000 → PostgreSQL</p>
        </div>
      </div>
    </aside>
  )
}
