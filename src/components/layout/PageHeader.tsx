import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backTo?: string
  right?: ReactNode
}

export function PageHeader({ title, subtitle, backTo, right }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="pt-[env(safe-area-inset-top)] sticky top-0 z-30 bg-notion-bg/95 backdrop-blur-sm border-b border-notion-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3 min-h-[52px]">
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-notion-text-secondary hover:bg-notion-bg-hover transition-colors shrink-0"
            aria-label="Back"
          >
            ←
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-notion-text truncate leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-notion-text-secondary truncate">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  )
}
