import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link2, BarChart3, Github } from 'lucide-react'
import { cn } from '../lib/utils'

export function Header() {
  const location = useLocation()

  const nav = [
    { to: '/', label: 'Acortar', icon: Link2 },
    { to: '/manage', label: 'Gestionar', icon: BarChart3 },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Link2 className="h-4 w-4" />
            </div>
            <span className="font-semibold text-neutral-900 tracking-tight">
              Link<span className="text-brand-600">Forge</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {nav.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                    active ? 'text-brand-700' : 'text-neutral-500 hover:text-neutral-800'
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-brand-50"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="relative h-4 w-4" />
                  <span className="relative hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}

            <a
              href="https://github.com/acostasssssssss"
              target="_blank"
              rel="noreferrer"
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
