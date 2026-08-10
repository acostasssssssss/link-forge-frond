import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Copy, Check, AlertTriangle, Clock, X } from 'lucide-react'
import { Button } from './ui/Button'
import type { ShortenResponse } from '../lib/api'

interface TokenModalProps {
  open: boolean
  link: ShortenResponse | null
  onClose: () => void
}

export function TokenModal({ open, link, onClose }: TokenModalProps) {
  const [copiedToken, setCopiedToken] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  if (!link) return null

  const copyToken = async () => {
    await navigator.clipboard.writeText(link.edit_token)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(link.short_url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const expiresLabel = link.expires_at
    ? new Date(link.expires_at).toLocaleDateString('es', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'en 6 días'

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-md rounded-2xl border border-[#2D3748] bg-[#151B2B] p-6 shadow-2xl shadow-indigo-500/10"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6366F1]/15 text-[#818CF8]">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#F1F5F9]">Link forjado</h2>
                <p className="text-sm text-[#94A3B8]">Guarda tu token de edición</p>
              </div>
            </div>

            {/* Short URL */}
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-[#64748B]">
                Tu link corto
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-2.5">
                <a
                  href={link.short_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 truncate font-mono text-sm text-[#818CF8] hover:underline"
                >
                  {link.short_url}
                </a>
                <button
                  onClick={copyUrl}
                  className="shrink-0 rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#6366F1]/20 hover:text-[#818CF8] transition-colors"
                  title="Copiar URL"
                >
                  {copiedUrl ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Token */}
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-[#64748B]">
                Token de edición
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-3 py-2.5">
                <code className="flex-1 break-all font-mono text-sm text-[#FBBF24]">
                  {link.edit_token}
                </code>
                <button
                  onClick={copyToken}
                  className="shrink-0 rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F59E0B]/15 hover:text-[#FBBF24] transition-colors"
                  title="Copiar token"
                >
                  {copiedToken ? (
                    <Check className="h-4 w-4 text-[#10B981]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Warnings */}
            <div className="mb-5 space-y-2">
              <div className="flex gap-2.5 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-3 py-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                <p className="text-xs leading-relaxed text-[#FBBF24]/90">
                  <strong>Guarda este token.</strong> Lo necesitas para editar el slug, cambiar el
                  destino o eliminar el link. Si lo pierdes, no podrás modificarlo.
                </p>
              </div>
              <div className="flex gap-2.5 rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/5 px-3 py-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#818CF8]" />
                <p className="text-xs leading-relaxed text-[#A5B4FC]">
                  Este link <strong>expira en 6 días</strong>
                  {link.expires_at ? ` (${expiresLabel})` : ''}. Después deberás crear uno nuevo.
                  Mientras uses este sistema no cierras sesión, tus links seguirán funcionando.
                  pero no se mostrarán en tu historial. ya que se guarda temporar en el navegador.
                </p>
              </div>
            </div>

            <Button onClick={onClose} className="w-full" size="lg">
              Entendido, ya lo guardé
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
