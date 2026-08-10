import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from './ui/Button'
import type { ShortenResponse } from '../lib/api'

interface QrModalProps {
  open: boolean
  link: ShortenResponse | null
  onClose: () => void
}

export function QrModal({ open, link, onClose }: QrModalProps) {
  const svgRef = useRef<HTMLDivElement>(null)

  const downloadPng = () => {
    if (!svgRef.current || !link) return
    const svg = svgRef.current.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      ctx.fillStyle = '#0B0F19'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(url)

      const a = document.createElement('a')
      a.download = `linkforge-${link.slug}-qr.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = url
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
            className="relative w-full max-w-sm rounded-2xl border border-[#2D3748] bg-[#151B2B] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#818CF8]" />
                <h2 className="text-lg font-semibold text-[#F1F5F9]">Código QR</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#1E2538] hover:text-[#F1F5F9] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div
                ref={svgRef}
                className="rounded-xl border border-[#2D3748] bg-[#0B0F19] p-4"
              >
                <QRCodeSVG
                  value={link.short_url}
                  size={200}
                  bgColor="#0B0F19"
                  fgColor="#F1F5F9"
                  level="M"
                  includeMargin={false}
                />
              </div>

              <p className="text-center font-mono text-sm text-[#818CF8] break-all">
                {link.short_url}
              </p>

              <Button onClick={downloadPng} className="w-full" variant="secondary">
                <Download className="h-4 w-4" />
                Descargar PNG
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
