import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Languages, MessageCircle, Phone, User, Video, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useSocket } from '../hooks/useSocket'
import { getSocket } from '../sockets/socketClient'
import IncomingCallModal from '../components/call/IncomingCallModal'

const nav = [
  { to: '/', label: 'Home', icon: MessageCircle },
  { to: '/calls', label: 'Calls', icon: Phone },
  { to: '/languages', label: 'Language', icon: Languages },
  { to: '/profile', label: 'Profile', icon: User }
]

export default function AppLayout() {
  useSocket()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [incomingCall, setIncomingCall] = useState(null)

  useEffect(() => {
    const socket = getSocket()
    const onIncomingCall = (call) => setIncomingCall(call)
    socket.on('incoming-call', onIncomingCall)
    return () => socket.off('incoming-call', onIncomingCall)
  }, [])

  function acceptIncomingCall() {
    const socket = getSocket()
    socket.emit('accept-call', { callId: incomingCall.callId, to: incomingCall.from })
    navigate(`/${incomingCall.type === 'audio' ? 'audio' : 'video'}/${incomingCall.from}`, { state: { incomingCall } })
    setIncomingCall(null)
  }

  function rejectIncomingCall() {
    const socket = getSocket()
    socket.emit('reject-call', { callId: incomingCall.callId, to: incomingCall.from })
    setIncomingCall(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl md:inset-y-0 md:left-0 md:right-auto md:w-24 md:border-r md:border-t-0">
        <div className="flex h-full items-center justify-around p-2 md:flex-col md:justify-start md:gap-4 md:py-6">
          <button className="hidden h-12 w-12 place-items-center rounded-lg bg-cyan-400 text-slate-950 md:grid" title="GlobalTalk AI">
            <Video size={22} />
          </button>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} title={label} className={({ isActive }) => `grid h-12 w-12 place-items-center rounded-lg transition ${isActive ? 'bg-white text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={21} />
            </NavLink>
          ))}
          <button
            className="grid h-12 w-12 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white md:mt-auto"
            title="Logout"
            onClick={async () => { await logout(); navigate('/login') }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>
      <main className="pb-20 md:ml-24 md:pb-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-xl md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">GLOBALTALK AI</p>
            <h1 className="text-lg font-semibold">Multilingual command center</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:block">{user?.preferredLanguage?.toUpperCase()} ready</span>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 font-semibold">{user?.fullName?.[0] || 'G'}</div>
          </div>
        </header>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8">
          <Outlet />
        </motion.div>
      </main>
      <IncomingCallModal call={incomingCall} onAccept={acceptIncomingCall} onReject={rejectIncomingCall} />
    </div>
  )
}
