import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, Copy, Check, ArrowRight, Sparkles, Globe, Shield, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { shortenUrl, type ShortenResponse } from '../lib/api'

export function Home() {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ShortenResponse | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!url.trim()) {
      setError('Ingresa una URL válida')
      return
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setError('La URL no es válida')
      return
    }

    setLoading(true)
    try {
      const data = await shortenUrl({
        target_url: url.startsWith('http') ? url : `https://${url}`,
        custom_slug: customSlug.trim() || undefined,
      })
      setResult(data)
      // Guardar edit_token en localStorage para poder editar después
      localStorage.setItem(`linkforge_token_${data.slug}`, data.edit_token)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'No se pudo acortar la URL. Verifica que el backend esté corriendo.'
      setError(typeof msg === 'string' ? msg : 'Error al acortar')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-brand-200/20 blur-3xl" />
        <div className="absolute top-40 right-1/4 h-48 w-48 rounded-full bg-sky-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Slugs y destinos 100% editables
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
              Acorta. Edita.{' '}
              <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">
                Controla.
              </span>
            </h1>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-10">
              El acortador open source que te deja renombrar el slug y cambiar el destino
              sin perder analytics. Ideal para marketing y redes.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-xl"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl shadow-neutral-200/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="url"
                  label="URL de destino"
                  placeholder="https://tu-dominio.com/pagina"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={error && !url ? error : undefined}
                />
                <Input
                  id="slug"
                  label="Slug personalizado (opcional)"
                  placeholder="promo-verano"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  hint="Solo letras, números y guiones"
                />

                {error && url && (
                  <p className="text-sm text-red-500 text-left">{error}</p>
                )}

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  <Link2 className="h-4 w-4" />
                  Acortar enlace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-neutral-100"
                  >
                    <p className="text-sm font-medium text-neutral-500 mb-2 text-left">
                      Tu enlace corto
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-left">
                        <a
                          href={result.short_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-700 font-medium hover:underline break-all"
                        >
                          {result.short_url}
                        </a>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => copyToClipboard(result.short_url)}
                        className="shrink-0"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-neutral-400 text-left">
                      Guarda este token para editar después:{' '}
                      <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                        {result.edit_token.slice(0, 12)}…
                      </code>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Globe,
              title: 'Slug editable',
              desc: 'Renombra tu link cuando una plataforma bloquee palabras. Los analytics se mantienen.',
            },
            {
              icon: Shield,
              title: 'Destino editable',
              desc: 'Cambia la URL de destino sin regenerar QR ni compartir de nuevo el link.',
            },
            {
              icon: Zap,
              title: 'Rápido y async',
              desc: 'Backend FastAPI + Redis. Redirecciones 307 y analytics en tiempo real.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 hover:shadow-lg hover:shadow-neutral-200/50 transition-shadow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">{f.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
