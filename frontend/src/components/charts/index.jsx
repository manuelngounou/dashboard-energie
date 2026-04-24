import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { appareilColor } from '../../utils/helpers'

/* ── Custom tooltip ───────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, unit = 'kWh' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      <p className="value">{payload[0]?.value} <span style={{fontSize:12,color:'#a0abc0'}}>{unit}</span></p>
    </div>
  )
}

/* ── Area chart — historique 7 jours ─────────────────────────────────── */
export function ConsommationAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00e5a0" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#00e5a0" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#5a6680', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#5a6680', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,229,160,0.15)', strokeWidth: 1 }} />
        <Area
          type="monotone" dataKey="total" stroke="#00e5a0" strokeWidth={2}
          fill="url(#gradGreen)" dot={{ fill: '#00e5a0', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#00e5a0', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ── Bar chart — historique mensuel ──────────────────────────────────── */
export function ConsommationBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#5a6680', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#5a6680', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="total" fill="#4d9fff" radius={[5, 5, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === data.length - 1 ? '#00e5a0' : '#4d9fff'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ── Pie chart — répartition par appareil ────────────────────────────── */
export function AppareilPieChart({ data }) {
  if (!data?.length) return null
  const formatted = data.map(d => ({
    name:  d.appareil || 'Non défini',
    value: parseFloat(d.total_kwh) || 0,
    color: appareilColor(d.appareil),
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={formatted} dataKey="value" nameKey="name"
          cx="50%" cy="50%" innerRadius={55} outerRadius={85}
          paddingAngle={3} strokeWidth={0}
        >
          {formatted.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v, n) => [`${parseFloat(v).toFixed(2)} kWh`, n]}
          contentStyle={{
            background: '#161b28', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, fontSize: 12, color: '#e2e8f4',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(v) => <span style={{ color: '#a0abc0', fontSize: 12 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

/* ── Mini spark bar (inline) ─────────────────────────────────────────── */
export function SparkBar({ data, color = '#00e5a0' }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={6}>
        <Bar dataKey="total" fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
