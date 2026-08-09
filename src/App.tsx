import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Manage } from './pages/Manage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage" element={<Manage />} />
          </Routes>
        </main>

        <footer className="border-t border-neutral-200">
          <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-neutral-400">
            <p>
              <span className="font-medium text-neutral-600">LinkForge</span> — Acortador open source
            </p>
            <p>FastAPI · React · Tailwind</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
