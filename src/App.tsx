import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { AuthPage } from './pages/AuthPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-[#0B0F19]">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />
            </Routes>
          </main>

          <footer className="border-t border-[#2D3748]">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-[#64748B] sm:flex-row">
              <p>
                © 2026 <span className="font-medium text-[#94A3B8]">LinkForge</span> · Open Source
              </p>
              <p className="text-xs">FastAPI · React · Tailwind</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}