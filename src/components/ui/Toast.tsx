import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  visible: boolean
  onClose: () => void
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const borders = {
  success: 'border-l-[#10B981]',
  error: 'border-l-[#EF4444]',
  info: 'border-l-[#6366F1]',
}

export function Toast({ message, type = 'info', visible, onClose }: ToastProps) {
  const Icon = icons[type]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className={cn(
            'fixed bottom-6 right-6 z-[100] flex items-center gap-3',
            'min-w-[280px] max-w-sm rounded-xl border border-[#2D3748] border-l-4',
            'bg-[#151B2B] px-4 py-3 shadow-2xl shadow-black/40',
            borders[type]
          )}
        >
          <Icon
            className={cn(
              'h-5 w-5 shrink-0',
              type === 'success' && 'text-[#10B981]',
              type === 'error' && 'text-[#EF4444]',
              type === 'info' && 'text-[#6366F1]'
            )}
          />
          <p className="flex-1 text-sm text-[#F1F5F9]">{message}</p>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
