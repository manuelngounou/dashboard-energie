import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { appareilChartColor } from '../../utils/helpers'

const AXIS = { fill: '#7aa5a5', fontSize: 11, fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 500 }
const GRID = 'rgba(208,234,234,0.8)'

function TealTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="teal-tooltip">
      <p className="tt-label">{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span className="tt-value">{payload[0]?.value}</span>
        <span className="tt-unit">kWh</span>
      </div>
    </div>
  )
}

/* ── Area ──────────────────────────────────────────────────────────── */
export function ConsommationAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#14b8b8" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#14b8b8" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 6" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip content={<TealTooltip />} cursor={{ stroke: 'rgba(20,184,184,0.2)', strokeWidth: 1 }} />
        <Area type="monotone" dataKey="total" stroke="#14b8b8" strokeWidth={2.5}
              fill="url(#tealGrad)"
              dot={{ fill: '#14b8b8', r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 5.5, fill: '#0e9b9b', stroke: '#fff', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ── Bar ────────────────────────────────────────────────────────────── */
export function ConsommationBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }} barSize={24}>
        <CartesianGrid strokeDasharray="3 6" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip content={<TealTooltip />} cursor={{ fill: 'rgba(20,184,184,0.05)' }} />
        <Bar dataKey="total" radius={[5, 5, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i}
                  fill={i === data.length - 1 ? '#14b8b8' : '#99ebeb'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ── Pie ────────────────────────────────────────────────────────────── */
export function AppareilPieChart({ data }) {
  if (!data?.length) return null
  const items = data.map(d => ({
    name:  d.appareil || 'Non défini',
    value: parseFloat(d.total_kwh) || 0,
    color: appareilChartColor(d.appareil),
  }))
  return (
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie data={items} dataKey="value" nameKey="name"
             cx="50%" cy="50%" innerRadius={52} outerRadius={82}
             paddingAngle={2} strokeWidth={2} stroke="#fff">
          {items.map((e, i) => <Cell key={i} fill={e.color} />)}
        </Pie>
        <Tooltip
          formatter={(v, n) => [`${parseFloat(v).toFixed(2)} kWh`, n]}
          contentStyle={{
            background: '#fff', border: '1px solid #d0eaea', borderRadius: 10,
            fontSize: 12, fontFamily: '"Plus Jakarta Sans",sans-serif',
            boxShadow: '0 8px 24px rgba(0,100,100,0.12)',
          }}
        />
        <Legend iconType="circle" iconSize={8}
                formatter={v => <span style={{ color: '#3d6363', fontSize: 11, fontFamily: '"Plus Jakarta Sans"' }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}
