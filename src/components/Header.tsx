import { Link } from 'react-router-dom'
import { Link2, Github, BookOpen } from 'lucide-react'

export function Header() {
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

        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9] transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">API Docs</span>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9] transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
