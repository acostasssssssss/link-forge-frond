import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#94A3B8]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-xl border bg-[#1E2538] text-[#F1F5F9]',
              'placeholder:text-[#64748B]',
              'focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 focus:border-[#6366F1]',
              'transition-all duration-200',
              icon ? 'pl-11 pr-4' : 'px-4',
              'py-3 h-[52px] text-[15px]',
              error
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
                : 'border-[#2D3748]',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
