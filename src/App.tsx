import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/store/AppContext'
import { AppShell } from '@/components/layout/AppShell'
import { WeeklyView } from '@/pages/WeeklyView/WeeklyView'
import { SessionView } from '@/pages/SessionView/SessionView'
import { ExerciseDetail } from '@/pages/ExerciseDetail/ExerciseDetail'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { ExerciseLibrary } from '@/pages/ExerciseLibrary/ExerciseLibrary'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<WeeklyView />} />
            <Route path="/session/:id" element={<SessionView />} />
            <Route path="/session/:sessionId/exercise/:exerciseId" element={<ExerciseDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  )
}
