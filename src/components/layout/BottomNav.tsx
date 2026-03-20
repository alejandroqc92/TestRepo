import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',           label: 'Week',      icon: '📅' },
  { to: '/dashboard',  label: 'Progress',  icon: '📈' },
  { to: '/exercises',  label: 'Exercises', icon: '🏋️' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-notion-bg border-t border-notion-border pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-xs transition-colors',
                isActive
                  ? 'text-notion-text font-medium'
                  : 'text-notion-text-secondary hover:text-notion-text',
              ].join(' ')
            }
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
