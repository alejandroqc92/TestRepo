import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-notion-text text-white hover:bg-black active:bg-black',
  secondary: 'bg-notion-bg-hover text-notion-text hover:bg-notion-border-dark border border-notion-border',
  ghost:     'text-notion-text hover:bg-notion-bg-hover active:bg-notion-border',
  danger:    'bg-notion-red-light text-notion-red hover:bg-red-100 border border-red-200',
}

const sizeClasses: Record<Size, string> = {
  sm:  'text-xs px-2.5 py-1.5 min-h-[32px]',
  md:  'text-sm px-3 py-2 min-h-[36px]',
  lg:  'text-sm px-4 py-2.5 min-h-[44px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors cursor-pointer select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
