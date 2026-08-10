import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Link2, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Toast, type ToastType } from '../components/ui/Toast'
import { UrlCard } from '../components/UrlCard'
import { EditModal } from '../components/EditModal'
import { QrModal } from '../components/QrModal'
import { useLocalLinks } from '../hooks/useLocalLinks'
import {
  shortenUrl,
  updateSlug,
  updateDestination,
  deleteUrl,
  getUrlInfo,
  type ShortenResponse,
} from '../lib/api'

export function Home() {
  const { links, addLink, updateLink, removeLink, getToken, loadingList } = useLocalLinks()

  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [showSlug, setShowSlug] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState<ShortenResponse | null>(null)

  const [modal, setModal] = useState<{
    open: boolean
    mode: 'slug' | 'destination'
    link: ShortenResponse | null
  }>({ open: false, mode: 'slug', link: null })

  const [qrLink, setQrLink] = useState<ShortenResponse | null>(null)

  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  })

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, visible: true })
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLastResult(null)

    if (!url.trim()) {
      setError('Ingresa una URL válida')
      return
    }

    let target = url.trim()
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`

    try {
      new URL(target)
    } catch {
      setError('La URL no es válida')
      return
    }

    setLoading(true)
    try {
      const data = await shortenUrl({
        target_url: target,
        custom_slug: showSlug && customSlug.trim() ? customSlug.trim() : undefined,
      })
      setLastResult(data)
      addLink(data)
      setUrl('')
      setCustomSlug('')
      showToast('Link forjado con éxito', 'success')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'No se pudo acortar. ¿Está el backend corriendo?'
      setError(typeof msg === 'string' ? msg : 'Error al acortar')
      showToast('Error al crear el link', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSave = async (value: string, token: string) => {
    if (!modal.link) return
    const oldSlug = modal.link.slug

    if (modal.mode === 'slug') {
      await updateSlug(oldSlug, value, token)
      // Refrescar info completa (el PATCH puede devolver solo un dict)
      const fresh = await getUrlInfo(value)
      updateLink(oldSlug, {
        ...modal.link,
        ...fresh,
        edit_token: token,
        slug: fresh.slug || value,
      })
      showToast('Slug actualizado', 'success')
    } else {
      await updateDestination(oldSlug, value, token)
      const fresh = await getUrlInfo(oldSlug)
      updateLink(oldSlug, {
        ...modal.link,
        ...fresh,
        edit_token: token,
        target_url: fresh.target_url || value,
      })
      showToast('Destino actualizado', 'success')
    }
  }

  const handleDelete = async (link: ShortenResponse) => {
    if (!confirm(`¿Desactivar el link "${link.slug}"?`)) return
    const token = getToken(link.slug)
    try {
      if (token) await deleteUrl(link.slug, token)
      removeLink(link.slug)
      showToast('Link desactivado', 'success')
    } catch {
      removeLink(link.slug)
      showToast('Eliminado localmente', 'info')
    }
  }

  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-[#6366F1]/10 blur-3xl" />
          <div className="absolute right-1/4 top-32 h-56 w-56 rounded-full bg-[#818CF8]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl px-4 pt-14 pb-10 sm:pt-20 sm:pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1 text-xs font-medium text-[#818CF8]">
              <Sparkles className="h-3.5 w-3.5" />
              Slugs y destinos 100% editables
            </div>

            <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#F1F5F9] sm:text-4xl">
              Forja links que{' '}
              <span className="bg-gradient-to-r from-[#818CF8] to-[#6366F1] bg-clip-text text-transparent">
                evolucionan
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-md text-[#94A3B8]">
              Acorta, renombra y cambia el destino sin perder analytics.
              Ideal para campañas y redes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-[#2D3748] bg-[#151B2B] p-5 sm:p-7 shadow-2xl shadow-black/30">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="url"
                  placeholder="https://ejemplo.com/mi-pagina-larga..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  icon={<Globe className="h-4 w-4" />}
                  error={error && !url ? error : undefined}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showSlug}
                      onClick={() => setShowSlug(!showSlug)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        showSlug ? 'bg-[#6366F1]' : 'bg-[#2D3748]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          showSlug ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                    <span className="text-sm text-[#94A3B8]">Slug personalizado</span>
                  </label>
                </div>

                <AnimatePresence>
                  {showSlug && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <Input
                        id="slug"
                        placeholder="promo-verano"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        hint="Solo letras, números y guiones"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && url && (
                  <p className="text-sm text-[#EF4444] text-left">{error}</p>
                )}

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  <Link2 className="h-4 w-4" />
                  Forjar Link
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <AnimatePresence>
                {lastResult && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 border-t border-[#2D3748] pt-5">
                      <p className="mb-2 text-left text-xs font-medium uppercase tracking-wider text-[#64748B]">
                        Tu link corto
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-3">
                        <a
                          href={lastResult.short_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-left font-mono text-sm text-[#818CF8] hover:underline break-all"
                        >
                          {lastResult.short_url}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-xl font-semibold text-[#F1F5F9]">Tus links</h2>
          {links.length > 0 && (
            <span className="rounded-full bg-[#1E2538] px-2.5 py-0.5 text-xs text-[#94A3B8]">
              {links.length}
            </span>
          )}
        </div>

        {links.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2D3748] py-16"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Link2 className="mb-4 h-12 w-12 text-[#2D3748]" />
            </motion.div>
            <p className="text-[#64748B]">Tu red está vacía. Forja tu primer link arriba.</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link, i) => (
              <UrlCard
                key={link.slug}
                link={link}
                index={i}
                onEditSlug={(l) => setModal({ open: true, mode: 'slug', link: l })}
                onEditDest={(l) => setModal({ open: true, mode: 'destination', link: l })}
                onDelete={handleDelete}
                onShowQr={(l) => setQrLink(l)}
              />
            ))}
          </div>
        )}
      </section>

      <EditModal
        open={modal.open}
        mode={modal.mode}
        link={modal.link}
        token={modal.link ? getToken(modal.link.slug) : ''}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onSave={handleEditSave}
      />

      <QrModal
        open={!!qrLink}
        link={qrLink}
        onClose={() => setQrLink(null)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  )
}
