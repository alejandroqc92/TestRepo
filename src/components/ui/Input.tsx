import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  suffix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, suffix, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide">{label}</label>}
        <div className="relative flex items-center">
          <input
            ref={ref}
            className={[
              'w-full bg-notion-bg border border-notion-border rounded-md px-3 py-2 text-sm text-notion-text',
              'placeholder:text-notion-text-tertiary',
              'focus:border-notion-text transition-colors min-h-[40px]',
              error ? 'border-notion-red' : '',
              suffix ? 'pr-10' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-xs text-notion-text-secondary pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-notion-red">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
