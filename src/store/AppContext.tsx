import { createContext, useContext, useReducer, useEffect, useRef, useState, type ReactNode } from 'react'
import { type AppState } from '@/types'
import { type Action } from './actions'
import { reducer } from './reducer'
import { getInitialState, loadState, saveState } from '@/lib/storage'
import { useAuth } from './AuthContext'

export interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  dataLoading: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)
  const [dataLoading, setDataLoading] = useState(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initializedFor = useRef<string | null>(null)

  // Load from Supabase once per user
  useEffect(() => {
    if (!user || initializedFor.current === user.id) return
    initializedFor.current = user.id
    setDataLoading(true)
    loadState(user.id).then(loaded => {
      dispatch({ type: 'LOAD_STATE', payload: loaded })
      setDataLoading(false)
    })
  }, [user])

  // Debounced save to Supabase
  useEffect(() => {
    if (!user || dataLoading) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveState(user.id, state), 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state, user, dataLoading])

  return (
    <AppContext.Provider value={{ state, dispatch, dataLoading }}>
      {dataLoading ? (
        <div className="min-h-svh bg-notion-bg flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-notion-border border-t-notion-text rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider')
  return ctx
}
