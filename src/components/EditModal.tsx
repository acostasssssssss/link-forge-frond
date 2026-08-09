import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import type { ShortenResponse } from '../lib/api'

interface EditModalProps {
  open: boolean
  mode: 'slug' | 'destination'
  link: ShortenResponse | null
  token: string
  onClose: () => void
  onSave: (value: string, token: string) => Promise<void>
}

export function EditModal({ open, mode, link, token: initialToken, onClose, onSave }: EditModalProps) {
  const [value, setValue] = useState('')
  const [token, setToken] = useState(initialToken)
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (link) {
      setValue(mode === 'slug' ? link.slug : link.target_url)
      setToken(initialToken)
      setError('')
    }
  }, [link, mode, initialToken, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || !token.trim()) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave(value.trim(), token.trim())
      onClose()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Error al guardar'
      setError(typeof msg === 'string' ? msg : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && link && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md rounded-2xl border border-[#2D3748] bg-[#151B2B] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F1F5F9]">
                {mode === 'slug' ? 'Editar slug' : 'Editar destino'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={mode === 'slug' ? 'Nuevo slug' : 'Nueva URL destino'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={mode === 'slug' ? 'mi-nuevo-slug' : 'https://...'}
                hint={mode === 'slug' ? 'Solo letras, números y guiones' : undefined}
              />

              <div className="relative">
                <Input
                  label="Edit token"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Token de edición"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-[38px] text-[#94A3B8] hover:text-[#F1F5F9]"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && <p className="text-sm text-[#EF4444]">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" loading={loading} className="flex-1">
                  Guardar cambios
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
