import { type ReactNode } from 'react'
import { BottomNav } from './BottomNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-notion-bg">
      <main>{children}</main>
      <BottomNav />
    </div>
  )
}
