import { motion } from 'framer-motion'
import { MousePointerClick, Users, Clock, Globe2 } from 'lucide-react'
import type { URLStats } from '../lib/api'

interface AnalyticsPanelProps {
  stats: URLStats | null
  loading: boolean
}

function relativeTime(iso?: string | null): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'hace un momento'
    if (mins < 60) return `hace ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 30) return `hace ${days}d`
    return d.toLocaleDateString('es')
  } catch {
    return iso
  }
}

/** Mini barra horizontal simple (sin librerías) */
function MiniBars({ data }: { data: { label: string; count: number }[] }) {
  if (!data.length) return null
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="space-y-2 mt-3">
      {data.slice(0, 5).map((d) => (
        <div key={d.label} className="flex items-center gap-2 text-xs">
          <span className="w-20 truncate text-[#94A3B8]" title={d.label}>
            {d.label || '(directo)'}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#1E2538] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
            />
          </div>
          <span className="w-6 text-right tabular-nums text-[#F1F5F9]">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

/** Sparkline SVG de clicks por día */
function Sparkline({ points }: { points: { date: string; count: number }[] }) {
  if (!points.length) return null
  const w = 240
  const h = 48
  const max = Math.max(...points.map((p) => p.count), 1)
  const step = points.length > 1 ? w / (points.length - 1) : w
  const coords = points.map((p, i) => {
    const x = i * step
    const y = h - (p.count / max) * (h - 4) - 2
    return `${x},${y}`
  })
  const line = coords.join(' ')
  const area = `0,${h} ${line} ${w},${h}`

  return (
    <div className="mt-3">
      <p className="text-[11px] text-[#64748B] mb-1">Clicks por día</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#sparkFill)" />
        <polyline
          points={line}
          fill="none"
          stroke="#818CF8"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function AnalyticsPanel({ stats, loading }: AnalyticsPanelProps) {
  if (loading) {
    return (
      <div className="mt-4 border-t border-[#2D3748] pt-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-[#1E2538] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="mt-4 border-t border-[#2D3748] pt-4">
        <p className="text-sm text-[#64748B]">Sin datos de analytics</p>
      </div>
    )
  }

  const total = stats.total_clicks ?? 0
  const unique = stats.unique_clicks ?? 0
  const uniquePct = total > 0 && unique > 0 ? Math.round((unique / total) * 100) : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 border-t border-[#2D3748] pt-4 space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#1E2538] p-3 relative overflow-hidden">
          <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-[#6366F1]/10" />
          <div className="flex items-center gap-1.5 text-[#94A3B8] mb-1">
            <MousePointerClick className="h-3.5 w-3.5" />
            <span className="text-[11px]">Clicks totales</span>
          </div>
          <p className="text-2xl font-bold tabular-nums text-[#F1F5F9]">{total}</p>
        </div>

        <div className="rounded-lg bg-[#1E2538] p-3 relative overflow-hidden">
          <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-[#10B981]/10" />
          <div className="flex items-center gap-1.5 text-[#94A3B8] mb-1">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[11px]">Clicks únicos</span>
          </div>
          <p className="text-2xl font-bold tabular-nums text-[#F1F5F9]">
            {unique || '—'}
            {uniquePct != null && (
              <span className="ml-1.5 text-xs font-medium text-[#10B981]">{uniquePct}%</span>
            )}
          </p>
        </div>

        <div className="rounded-lg bg-[#1E2538] p-3 col-span-2 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Último click</p>
            <p className="text-sm font-medium text-[#F1F5F9]">
              {relativeTime(stats.last_click)}
            </p>
          </div>
        </div>
      </div>

      {/* Sparkline si el backend envía clicks_by_day */}
      {stats.clicks_by_day && stats.clicks_by_day.length > 0 && (
        <Sparkline points={stats.clicks_by_day} />
      )}

      {/* Top referrers */}
      {stats.top_referrers && stats.top_referrers.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mb-1">
            <Globe2 className="h-3 w-3" />
            Top referrers
          </div>
          <MiniBars
            data={stats.top_referrers.map((r) => ({
              label: r.referrer?.replace(/^https?:\/\//, '') || '(directo)',
              count: r.count,
            }))}
          />
        </div>
      )}

      {/* Top countries */}
      {stats.top_countries && stats.top_countries.length > 0 && (
        <div>
          <p className="text-[11px] text-[#64748B] mb-1">Países</p>
          <MiniBars
            data={stats.top_countries.map((c) => ({
              label: c.country || '??',
              count: c.count,
            }))}
          />
        </div>
      )}
    </motion.div>
  )
}
