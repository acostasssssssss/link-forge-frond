import { Link, useLocation } from 'react-router-dom'
import { Link2, Github, BookOpen, LogIn, UserPlus, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const backendUrl = (import.meta.env.VITE_API_URL || 'https://cort-link.onrender.com').replace(/\/$/, '')
  const docsUrl = `${backendUrl}/docs`
  const githubRepoUrl = 'https://github.com/acostasssssssss/link-forge-frond'

  const displayName = user?.username || user?.email?.split('@')[0] || 'Usuario'

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#2D3748]/80 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6366F1] text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Link2 className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-[#F1F5F9]">
            Link<span className="text-[#818CF8]">Forge</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9] transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">API Docs</span>
          </a>
          <a
            href={githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9] transition-colors"
            title="Repositorio en GitHub"
          >
            <Github className="h-4 w-4" />
          </a>

          <div className="mx-1 h-5 w-px bg-[#2D3748]" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-xl border border-[#2D3748] bg-[#151B2B] px-3 py-1.5 text-xs font-medium text-[#F1F5F9] hover:border-[#6366F1]/40 transition-colors"
                title={user?.email}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6366F1]/20 text-[#818CF8]">
                  <User className="h-3.5 w-3.5" />
                </span>
                <span className="max-w-[110px] truncate sm:max-w-[160px]">{displayName}</span>
                <span className="h-2 w-2 rounded-full bg-[#10B981]" title="Sesión activa" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-xl border border-[#2D3748] bg-[#1E2538]/70 px-3 py-2 text-xs font-medium text-[#94A3B8] hover:border-red-500/30 hover:bg-red-500/10 hover:text-[#EF4444] transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/login"
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  location.pathname === '/login'
                    ? 'bg-[#1E2538] text-[#F1F5F9]'
                    : 'text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9]'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Iniciar sesión</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-xl bg-[#6366F1] px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-[#818CF8] transition-all"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Crear cuenta</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}