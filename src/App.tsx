import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/store/AuthContext'
import { AppProvider } from '@/store/AppContext'
import { AppShell } from '@/components/layout/AppShell'
import { WeeklyView } from '@/pages/WeeklyView/WeeklyView'
import { SessionView } from '@/pages/SessionView/SessionView'
import { ExerciseDetail } from '@/pages/ExerciseDetail/ExerciseDetail'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { ExerciseLibrary } from '@/pages/ExerciseLibrary/ExerciseLibrary'
import { AuthPage } from '@/pages/Auth/AuthPage'

function AuthenticatedApp() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-svh bg-notion-bg flex items-center justify-center">
        <span className="w-5 h-5 border-2 border-notion-border border-t-notion-text rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<WeeklyView />} />
          <Route path="/session/:id" element={<SessionView />} />
          <Route path="/session/:sessionId/exercise/:exerciseId" element={<ExerciseDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
        </Routes>
      </AppShell>
    </AppProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthenticatedApp />
      </BrowserRouter>
    </AuthProvider>
  )
}
