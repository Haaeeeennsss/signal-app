import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Auth        from './pages/Auth'
import Setup       from './pages/Setup'
import JoinSquad   from './pages/JoinSquad'
import Dashboard   from './pages/Dashboard'
import Landing     from './pages/Landing'
import Onboarding  from './pages/Onboarding'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">⚡</div>
        <p className="text-gray-600 text-sm">Loading Signal...</p>
      </div>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />
  if (!user)   return <Navigate to="/auth" state={{ from: location }} replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user)    return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"            element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/quiz"        element={<PublicRoute><Onboarding /></PublicRoute>} />
      <Route path="/auth"        element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/setup"       element={<PrivateRoute><Setup /></PrivateRoute>} />
      <Route path="/join/:code"  element={<PrivateRoute><JoinSquad /></PrivateRoute>} />
      <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="*"            element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
