import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Check,
  Pencil,
  Target,
  Trash2,
  BarChart3,
  ExternalLink,
} from 'lucide-react'
import type { ShortenResponse, Analytics } from '../lib/api'
import { getAnalytics } from '../lib/api'
import { cn } from '../lib/utils'

interface UrlCardProps {
  link: ShortenResponse
  onEditSlug: (link: ShortenResponse) => void
  onEditDest: (link: ShortenResponse) => void
  onDelete: (link: ShortenResponse) => void
  index: number
}

export function UrlCard({ link, onEditSlug, onEditDest, onDelete, index }: UrlCardProps) {
  const [copied, setCopied] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(link.short_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleStats = async () => {
    if (showStats) {
      setShowStats(false)
      return
    }
    setShowStats(true)
    if (!analytics) {
      setLoadingStats(true)
      try {
        const data = await getAnalytics(link.slug)
        setAnalytics(data)
      } catch {
        setAnalytics({ slug: link.slug, total_clicks: 0 })
      } finally {
        setLoadingStats(false)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'group rounded-xl border border-[#2D3748] bg-[#151B2B] p-5',
        'transition-all duration-200 ease-out',
        'hover:border-[#6366F1]/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]'
      )}
    >
      {/* Top badges */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-md bg-[#1E2538] px-2 py-0.5 text-[11px] font-medium text-[#94A3B8] font-mono">
          {link.redirect_type || '307'}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-[11px] font-medium',
            link.is_active
              ? 'bg-emerald-500/10 text-[#10B981]'
              : 'bg-neutral-500/10 text-[#94A3B8]'
          )}
        >
          {link.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Slug */}
      <a
        href={link.short_url}
        target="_blank"
        rel="noreferrer"
        className="mb-1 flex items-center gap-1.5 font-mono text-lg font-semibold text-[#818CF8] hover:text-[#A5B4FC] transition-colors break-all"
      >
        {link.short_url.replace(/^https?:\/\//, '')}
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      {/* Destination */}
      <p className="mb-4 text-sm text-[#94A3B8] truncate" title={link.target_url}>
        → {link.target_url}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ActionBtn onClick={copy} title="Copiar">
          {copied ? (
            <Check className="h-4 w-4 text-[#10B981]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </ActionBtn>
        <ActionBtn onClick={() => onEditSlug(link)} title="Editar slug">
          <Pencil className="h-4 w-4" />
        </ActionBtn>
        <ActionBtn onClick={() => onEditDest(link)} title="Editar destino">
          <Target className="h-4 w-4" />
        </ActionBtn>
        <ActionBtn onClick={toggleStats} title="Stats" active={showStats}>
          <BarChart3 className="h-4 w-4" />
        </ActionBtn>
        <ActionBtn onClick={() => onDelete(link)} title="Eliminar" danger>
          <Trash2 className="h-4 w-4" />
        </ActionBtn>
      </div>

      {/* Stats panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-[#2D3748] pt-4">
              {loadingStats ? (
                <p className="text-sm text-[#94A3B8]">Cargando…</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#1E2538] p-3">
                    <p className="text-2xl font-bold tabular-nums text-[#F1F5F9]">
                      {analytics?.total_clicks ?? 0}
                    </p>
                    <p className="text-xs text-[#94A3B8]">Clicks totales</p>
                  </div>
                  <div className="rounded-lg bg-[#1E2538] p-3">
                    <p className="text-2xl font-bold tabular-nums text-[#F1F5F9]">
                      {analytics?.unique_clicks ?? '—'}
                    </p>
                    <p className="text-xs text-[#94A3B8]">Clicks únicos</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ActionBtn({
  children,
  onClick,
  title,
  danger,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150',
        'text-[#94A3B8] hover:scale-110',
        danger
          ? 'hover:bg-red-500/10 hover:text-[#EF4444]'
          : 'hover:bg-[#6366F1]/15 hover:text-[#818CF8]',
        active && 'bg-[#6366F1]/15 text-[#818CF8]'
      )}
    >
      {children}
    </button>
  )
}
