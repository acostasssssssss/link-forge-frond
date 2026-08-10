import { motion } from 'framer-motion'
import { History, ArrowRight, Link2, Globe } from 'lucide-react'
import type { LinkHistory } from '../lib/api'

interface HistoryPanelProps {
  history: LinkHistory | null
  loading: boolean
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function HistoryPanel({ history, loading }: HistoryPanelProps) {
  if (loading) {
    return (
      <div className="mt-4 border-t border-[#2D3748] pt-4">
        <p className="text-sm text-[#94A3B8]">Cargando historial…</p>
      </div>
    )
  }

  const slugHist = history?.slug_history ?? []
  const destHist = history?.destination_history ?? []
  const total = slugHist.length + destHist.length

  if (!total) {
    return (
      <div className="mt-4 border-t border-[#2D3748] pt-4">
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <History className="h-4 w-4" />
          Sin cambios registrados aún
        </div>
        <p className="mt-1 text-[11px] text-[#475569]">
          Los cambios de slug y destino aparecerán aquí cuando el backend exponga el historial.
        </p>
      </div>
    )
  }

  // Unificar y ordenar por fecha desc
  type Unified = {
    type: 'slug' | 'destination'
    old: string
    neu: string
    at: string
  }

  const unified: Unified[] = [
    ...slugHist.map((e) => ({
      type: 'slug' as const,
      old: e.old_code,
      neu: e.new_code,
      at: e.changed_at,
    })),
    ...destHist.map((e) => ({
      type: 'destination' as const,
      old: e.old_target_url,
      neu: e.new_target_url,
      at: e.changed_at,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 border-t border-[#2D3748] pt-4"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
        <History className="h-4 w-4 text-[#818CF8]" />
        Historial de cambios
        <span className="rounded-full bg-[#1E2538] px-2 py-0.5 text-[11px]">{total}</span>
      </div>

      <ul className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {unified.map((entry, i) => (
          <li key={i} className="rounded-lg bg-[#1E2538] px-3 py-2.5 text-left">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#818CF8]">
                {entry.type === 'slug' ? (
                  <>
                    <Link2 className="h-3 w-3" /> Slug renombrado
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3" /> Destino cambiado
                  </>
                )}
              </span>
              <span className="text-[11px] text-[#64748B] shrink-0">
                {formatDate(entry.at)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono break-all">
              <span className="text-[#64748B] line-through opacity-80">{entry.old}</span>
              <ArrowRight className="h-3 w-3 shrink-0 text-[#6366F1]" />
              <span className="text-[#F1F5F9]">{entry.neu}</span>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
