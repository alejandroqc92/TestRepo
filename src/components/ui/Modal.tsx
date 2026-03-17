import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      {/* Sheet */}
      <div className="relative z-10 w-full sm:max-w-md bg-notion-bg rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col max-h-[90svh]">
        {title && (
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-notion-border shrink-0">
            <h2 className="text-base font-semibold text-notion-text">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md text-notion-text-secondary hover:bg-notion-bg-hover transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 pb-5 pt-3 border-t border-notion-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
