import { type ReactNode } from 'react'

type BadgeVariant = 'default' | 'green' | 'red' | 'yellow' | 'blue' | 'purple'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-notion-bg-hover text-notion-text-secondary',
  green:   'bg-notion-green-light text-notion-green',
  red:     'bg-notion-red-light text-notion-red',
  yellow:  'bg-notion-yellow-light text-notion-yellow',
  blue:    'bg-notion-accent-light text-notion-accent',
  purple:  'bg-notion-purple-light text-notion-purple',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
