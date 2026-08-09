import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-[#6366F1] text-white hover:bg-[#818CF8] shadow-lg shadow-indigo-500/20',
      secondary:
        'bg-[#1E2538] text-[#F1F5F9] border border-[#2D3748] hover:border-[#6366F1]/50 hover:bg-[#151B2B]',
      ghost: 'bg-transparent text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E2538]',
      danger: 'bg-red-500/10 text-[#EF4444] border border-red-500/20 hover:bg-red-500/20',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg h-9',
      md: 'px-4 py-2.5 text-sm rounded-xl h-[42px]',
      lg: 'px-6 py-3 text-base rounded-xl h-[52px]',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
