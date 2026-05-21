import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/Chat'
import VideoCallPage from './pages/VideoCallPage'
import AudioCallPage from './pages/AudioCallPage'
import ProfileSettings from './pages/ProfileSettings'
import LanguageSettings from './pages/LanguageSettings'
import CallHistoryPage from './pages/CallHistoryPage'
import { useAuthStore } from './store/authStore'

function Protected({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  return accessToken ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Protected><AppLayout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="chat/:id" element={<ChatPage />} />
        <Route path="video/:userId" element={<VideoCallPage />} />
        <Route path="audio/:userId" element={<AudioCallPage />} />
        <Route path="calls" element={<CallHistoryPage />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="languages" element={<LanguageSettings />} />
      </Route>
    </Routes>
  )
}
