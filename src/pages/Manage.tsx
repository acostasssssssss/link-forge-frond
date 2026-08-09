import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Pencil,
  ExternalLink,
  BarChart3,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import {
  getUrlInfo,
  updateSlug,
  updateDestination,
  deleteUrl,
  getAnalytics,
  type UrlInfo,
  type Analytics,
} from '../lib/api'

export function Manage() {
  const [slug, setSlug] = useState('')
  const [editToken, setEditToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState<UrlInfo | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  const [newSlug, setNewSlug] = useState('')
  const [newDest, setNewDest] = useState('')
  const [editing, setEditing] = useState<'slug' | 'dest' | null>(null)
  const [success, setSuccess] = useState('')

  const loadInfo = async () => {
    if (!slug.trim()) {
      setError('Ingresa un slug')
      return
    }
    setError('')
    setSuccess('')
    setLoading(true)
    setInfo(null)
    setAnalytics(null)

    // Intentar recuperar token guardado
    const saved = localStorage.getItem(`linkforge_token_${slug.trim()}`)
    if (saved && !editToken) setEditToken(saved)

    try {
      const data = await getUrlInfo(slug.trim())
      setInfo(data)
      setNewSlug(data.slug)
      setNewDest(data.target_url)

      try {
        const an = await getAnalytics(slug.trim())
        setAnalytics(an)
      } catch {
        // analytics opcional
      }
    } catch {
      setError('No se encontró el enlace o el backend no responde')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSlug = async () => {
    if (!info || !editToken) {
      setError('Necesitas el edit_token para modificar')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await updateSlug(info.slug, newSlug, editToken)
      setInfo({ ...info, slug: data.slug, short_url: data.short_url })
      localStorage.setItem(`linkforge_token_${data.slug}`, editToken)
      localStorage.removeItem(`linkforge_token_${info.slug}`)
      setSuccess('Slug actualizado correctamente')
      setEditing(null)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Error al actualizar el slug'
      setError(typeof msg === 'string' ? msg : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDest = async () => {
    if (!info || !editToken) {
      setError('Necesitas el edit_token para modificar')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await updateDestination(info.slug, newDest, editToken)
      setInfo({ ...info, target_url: data.target_url })
      setSuccess('Destino actualizado correctamente')
      setEditing(null)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Error al actualizar el destino'
      setError(typeof msg === 'string' ? msg : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!info || !editToken) return
    if (!confirm('¿Desactivar este enlace?')) return
    setLoading(true)
    try {
      await deleteUrl(info.slug, editToken)
      setInfo(null)
      setAnalytics(null)
      setSuccess('Enlace desactivado')
    } catch {
      setError('No se pudo desactivar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Gestionar enlace</h1>
        <p className="text-neutral-500 mb-8">
          Busca un slug para ver info, editar o ver analytics.
        </p>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="slug-del-enlace"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1"
            />
            <Button onClick={loadInfo} loading={loading}>
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>

          <Input
            label="Edit token (requerido para editar)"
            placeholder="aB3xK9mP..."
            value={editToken}
            onChange={(e) => setEditToken(e.target.value)}
            hint="Se guarda automáticamente al crear el enlace"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700"
          >
            <Check className="h-4 w-4 shrink-0" />
            {success}
          </motion.div>
        )}

        <AnimatePresence>
          {info && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-4"
            >
              {/* Info card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">
                      Enlace corto
                    </p>
                    <a
                      href={info.short_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg font-semibold text-brand-600 hover:underline flex items-center gap-1.5"
                    >
                      {info.short_url}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      info.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {info.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-neutral-500">Destino</span>
                    <span className="text-neutral-800 break-all text-right max-w-[60%]">
                      {info.target_url}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Creado</span>
                    <span className="text-neutral-800">
                      {new Date(info.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Edit actions */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditing(editing === 'slug' ? null : 'slug')}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar slug
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditing(editing === 'dest' ? null : 'dest')}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar destino
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Desactivar
                  </Button>
                </div>

                {/* Edit forms */}
                <AnimatePresence>
                  {editing === 'slug' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-neutral-100 space-y-3 overflow-hidden"
                    >
                      <Input
                        label="Nuevo slug"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                      />
                      <Button onClick={handleUpdateSlug} loading={loading} size="sm">
                        Guardar slug
                      </Button>
                    </motion.div>
                  )}
                  {editing === 'dest' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-neutral-100 space-y-3 overflow-hidden"
                    >
                      <Input
                        label="Nueva URL destino"
                        value={newDest}
                        onChange={(e) => setNewDest(e.target.value)}
                      />
                      <Button onClick={handleUpdateDest} loading={loading} size="sm">
                        Guardar destino
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Analytics */}
              {analytics && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-brand-600" />
                    <h3 className="font-semibold text-neutral-900">Analytics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-brand-50 p-4">
                      <p className="text-2xl font-bold text-brand-700">
                        {analytics.total_clicks ?? 0}
                      </p>
                      <p className="text-sm text-brand-600/80">Clicks totales</p>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-4">
                      <p className="text-2xl font-bold text-neutral-700">
                        {analytics.unique_clicks ?? '—'}
                      </p>
                      <p className="text-sm text-neutral-500">Clicks únicos</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
