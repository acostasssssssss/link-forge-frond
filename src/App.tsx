import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#0B0F19]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
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
  )
}
