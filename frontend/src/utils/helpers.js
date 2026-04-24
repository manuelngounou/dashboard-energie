import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

/** Formate une date ISO ou objet Date en chaîne lisible */
export function fmtDate(d, pattern = 'd MMM yyyy') {
  if (!d) return '—'
  const date = typeof d === 'string' ? parseISO(d) : d
  return format(date, pattern, { locale: fr })
}

export function fmtDateInput(d) {
  return format(typeof d === 'string' ? parseISO(d) : d, 'yyyy-MM-dd')
}

export function fmtKwh(n) {
  if (n == null) return '—'
  return `${parseFloat(n).toFixed(2)} kWh`
}

export function fmtKwhShort(n) {
  if (n == null) return '—'
  return parseFloat(n).toFixed(1)
}

export function fmtEuros(kwh, tarif = 0.2516) {
  return `${(parseFloat(kwh) * tarif).toFixed(2)} €`
}

export function fmtPct(val, ref) {
  if (!val || !ref || parseFloat(ref) === 0) return null
  const pct = ((parseFloat(val) - parseFloat(ref)) / parseFloat(ref)) * 100
  return pct
}

/** Couleur Tailwind par type d'appareil */
export function appareilColor(name) {
  if (!name) return '#5a6680'
  const n = name.toLowerCase()
  if (n.includes('chauffage') || n.includes('chauf')) return '#ff8c42'
  if (n.includes('éclairage') || n.includes('eclair') || n.includes('lumi')) return '#ffd166'
  if (n.includes('cuisine') || n.includes('frigo') || n.includes('four')) return '#4d9fff'
  if (n.includes('télé') || n.includes('tele') || n.includes('tv') || n.includes('multi')) return '#b06fff'
  if (n.includes('lavage') || n.includes('lave') || n.includes('électro')) return '#00e5a0'
  if (n.includes('clim') || n.includes('pompe')) return '#80ffcf'
  return '#a0abc0'
}

export function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

/** Regroupe les consommations par mois (pour graphique historique) */
export function groupByMonth(consommations) {
  if (!consommations?.length) return []
  const map = {}
  consommations.forEach(c => {
    const month = c.date_mesure?.slice(0, 7) // "2026-04"
    if (!month) return
    if (!map[month]) map[month] = { month, total: 0, count: 0 }
    map[month].total += parseFloat(c.kwh) || 0
    map[month].count++
  })
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      ...m,
      label: format(parseISO(`${m.month}-01`), 'MMM yy', { locale: fr }),
      total: parseFloat(m.total.toFixed(2)),
      moyenne: parseFloat((m.total / m.count).toFixed(2)),
    }))
}

/** Regroupe les consommations par semaine (7 derniers jours) */
export function last7Days(consommations) {
  if (!consommations?.length) return []
  const today = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const iso = format(d, 'yyyy-MM-dd')
    const label = format(d, 'EEE', { locale: fr })
    const total = consommations
      .filter(c => c.date_mesure === iso)
      .reduce((s, c) => s + parseFloat(c.kwh || 0), 0)
    days.push({ date: iso, label, total: parseFloat(total.toFixed(2)) })
  }
  return days
}

export function clsx(...args) {
  return args.filter(Boolean).join(' ')
}
