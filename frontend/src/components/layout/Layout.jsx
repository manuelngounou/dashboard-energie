import Sidebar from './Sidebar'

export default function Layout({ children, title, subtitle, actions }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between
                           px-7 border-b border-white/[0.06] bg-surface/80 backdrop-blur-md">
          <div>
            <h1 className="font-display font-bold text-base text-ink leading-none">{title}</h1>
            {subtitle && <p className="text-xs text-ink-3 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        <main className="flex-1 p-7 animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  )
}
