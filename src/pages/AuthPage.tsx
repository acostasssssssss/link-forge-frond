import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Infinity as InfinityIcon,
  Layers,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

interface AuthPageProps {
  initialMode?: 'login' | 'register'
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, isAuthenticated } = useAuth()

  const modeFromPath = location.pathname === '/register' ? 'register' : initialMode
  const [mode, setMode] = useState<'login' | 'register'>(modeFromPath)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMode(location.pathname === '/register' ? 'register' : 'login')
    setError('')
  }, [location.pathname])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const switchMode = (nextMode: 'login' | 'register') => {
    setError('')
    setMode(nextMode)
    navigate(nextMode === 'register' ? '/register' : '/login', { replace: true })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Ingresa un correo electrónico válido')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ email: cleanEmail, password })
      } else {
        await register({
          email: cleanEmail,
          password,
          username: username.trim() ? username.trim() : undefined,
        })
      }
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError(
          mode === 'login'
            ? 'No se pudo iniciar sesión. Verifica tus credenciales.'
            : 'No se pudo crear la cuenta. Intenta con otro correo.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <section className="relative overflow-hidden py-10 sm:py-16">
        {/* Luces de fondo idénticas al Hero de Home */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-8 h-72 w-72 rounded-full bg-[#6366F1]/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-8 h-64 w-64 rounded-full bg-[#818CF8]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 text-center"
          >
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al acortador
            </Link>

            <div>
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1 text-xs font-medium text-[#818CF8]">
                <Sparkles className="h-3.5 w-3.5" />
                Enlaces permanentes y panel privado
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-3xl">
              {mode === 'login' ? (
                <>
                  Bienvenido de nuevo a{' '}
                  <span className="bg-gradient-to-r from-[#818CF8] to-[#6366F1] bg-clip-text text-transparent">
                    LinkForge
                  </span>
                </>
              ) : (
                <>
                  Crea tu cuenta en{' '}
                  <span className="bg-gradient-to-r from-[#818CF8] to-[#6366F1] bg-clip-text text-transparent">
                    LinkForge
                  </span>
                </>
              )}
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              {mode === 'login'
                ? 'Accede a todos tus links permanentes desde cualquier navegador.'
                : 'Guarda tus enlaces sin fecha de expiración y edítalos cuando quieras.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-2xl border border-[#2D3748] bg-[#151B2B] p-6 sm:p-7 shadow-2xl shadow-black/40"
          >
            {/* Selector de pestañas Iniciar sesión / Crear cuenta */}
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#0B0F19]/70 p-1 border border-[#2D3748]/80">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`relative rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  mode === 'login' ? 'text-[#F1F5F9]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {mode === 'login' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-[#6366F1] shadow-md shadow-indigo-500/25"
                  />
                )}
                <span className="relative z-10">Iniciar sesión</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`relative rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  mode === 'register' ? 'text-[#F1F5F9]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {mode === 'register' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-[#6366F1] shadow-md shadow-indigo-500/25"
                  />
                )}
                <span className="relative z-10">Crear cuenta</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence initial={false}>
                {mode === 'register' && (
                  <motion.div
                    key="username-field"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-1">
                      <Input
                        id="username"
                        label="Nombre o alias (opcional)"
                        placeholder="ej. carlosdev"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<User className="h-4 w-4" />}
                        autoComplete="username"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                id="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                autoComplete="email"
                required
              />

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  hint={mode === 'register' ? 'Mínimo 6 caracteres' : undefined}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[42px] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                  tabIndex={-1}
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-[#EF4444]"
                >
                  {error}
                </motion.div>
              )}

              <div className="pt-1">
                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  {mode === 'login' ? 'Entrar a mi cuenta' : 'Crear cuenta gratis'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Beneficios del modo con cuenta */}
            <div className="mt-6 border-t border-[#2D3748] pt-5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-[#94A3B8]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/15 text-[#818CF8]">
                  <InfinityIcon className="h-3.5 w-3.5" />
                </div>
                <span>Tus links no caducan a los 6 días: permanecen hasta que los elimines.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#94A3B8]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-[#10B981]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>Edita slugs y destinos sin necesidad de pegar el token cada vez.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#94A3B8]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/15 text-[#818CF8]">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <span>Aislamiento Multi-Tenant: cada cuenta ve y controla únicamente sus links.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}