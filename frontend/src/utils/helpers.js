import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export const fmtDate    = (d, p = 'd MMM yyyy') => d ? format(typeof d === 'string' ? parseISO(d) : d, p, { locale: fr }) : '—'
export const todayISO   = ()  => format(new Date(), 'yyyy-MM-dd')

export const fmtKwh  = (n) => n == null ? '—' : `${parseFloat(n).toFixed(2)} kWh`
export const fmtEuro = (n, t = 0.2516) => n == null ? '—' : `${(parseFloat(n) * t).toFixed(2)} €`

export function appareilColor(name) {
  if (!name) return { bg: '#f0fafa', text: '#7aa5a5', border: '#d0eaea' }
  const n = name.toLowerCase()
  if (n.includes('chauffage'))                        return { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' }
  if (n.includes('éclairage') || n.includes('lumi')) return { bg: '#fefce8', text: '#ca8a04', border: '#fde68a' }
  if (n.includes('cuisine') || n.includes('frigo'))  return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' }
  if (n.includes('télé') || n.includes('tv'))        return { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff' }
  if (n.includes('lavage') || n.includes('lave'))    return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' }
  if (n.includes('clim'))                            return { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' }
  if (n.includes('ordinateur') || n.includes('pc'))  return { bg: '#f0fafa', text: '#14b8b8', border: '#99ebeb' }
  return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' }
}

export function appareilChartColor(name) {
  const map = {
    chauffage:  '#f97316',
    éclairage:  '#eab308',
    lumière:    '#eab308',
    cuisine:    '#3b82f6',
    frigo:      '#3b82f6',
    télé:       '#a855f7',
    tv:         '#a855f7',
    lavage:     '#22c55e',
    lave:       '#22c55e',
    clim:       '#06b6d4',
    ordinateur: '#14b8b8',
    pc:         '#14b8b8',
  }
  if (!name) return '#94a3b8'
  const n = name.toLowerCase()
  for (const [key, color] of Object.entries(map)) {
    if (n.includes(key)) return color
  }
  return '#94a3b8'
}

export function groupByMonth(data) {
  if (!data?.length) return []
  const map = {}
  data.forEach(c => {
    const m = c.date_mesure?.slice(0, 7)
    if (!m) return
    if (!map[m]) map[m] = { month: m, total: 0, count: 0 }
    map[m].total += parseFloat(c.kwh) || 0
    map[m].count++
  })
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      ...m,
      label: format(parseISO(`${m.month}-01`), 'MMM yy', { locale: fr }),
      total: +m.total.toFixed(2),
    }))
}

export function last7Days(data) {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const iso   = format(d, 'yyyy-MM-dd')
    const total = (data ?? []).filter(c => c.date_mesure === iso).reduce((s, c) => s + parseFloat(c.kwh || 0), 0)
    return { date: iso, label: format(d, 'EEE', { locale: fr }), total: +total.toFixed(2) }
  })
}

export function last30Days(data) {
  const today = new Date()
  const days  = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (29 - i))
    const iso   = format(d, 'yyyy-MM-dd')
    const total = (data ?? []).filter(c => c.date_mesure === iso).reduce((s, c) => s + parseFloat(c.kwh || 0), 0)
    return { label: `${d.getDate()}/${d.getMonth() + 1}`, total: +total.toFixed(2) }
  })
  const grouped = []
  for (let i = 0; i < days.length; i += 3) {
    const chunk = days.slice(i, i + 3)
    grouped.push({ label: chunk[0].label, total: +chunk.reduce((s, d) => s + d.total, 0).toFixed(2) })
  }
  return grouped
}
