import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Search, Video, Phone } from 'lucide-react'
import { api } from '../services/api'
import { useChatStore } from '../store/chatStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { chats, loadChats, createChat } = useChatStore()
  const [q, setQ] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => { loadChats() }, [loadChats])
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!q.trim()) return setUsers([])
      const { data } = await api.get(`/users/search?q=${encodeURIComponent(q)}`)
      setUsers(data.users)
    }, 250)
    return () => clearTimeout(timer)
  }, [q])

  async function startChat(userId) {
    const chat = await createChat(userId)
    navigate(`/chat/${chat._id}`)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-2xl font-semibold">Conversations</h2><p className="text-sm text-slate-400">Realtime chat with AI translated delivery.</p></div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input className="field pl-10" placeholder="Search global users" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-3">
          {chats.map((chat) => {
            const peer = chat.participants?.find((p) => p._id !== JSON.parse(localStorage.getItem('globaltalk:user') || '{}')._id) || chat.participants?.[0]
            return (
              <Link key={chat._id} to={`/chat/${chat._id}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 font-semibold">{peer?.fullName?.[0] || 'U'}</div>
                  <div className="min-w-0"><p className="font-medium">{peer?.fullName || 'Direct chat'}</p><p className="truncate text-sm text-slate-400">{chat.lastMessage?.translatedContent || chat.lastMessage?.originalContent || 'No messages yet'}</p></div>
                </div>
                <MessageCircle className="text-cyan-300" size={20} />
              </Link>
            )
          })}
        </div>
      </section>
      <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 font-semibold">People</h3>
        <div className="grid gap-3">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-900 p-3">
              <div><p className="font-medium">{user.fullName}</p><p className="text-xs text-slate-400">@{user.username} · {user.preferredLanguage?.toUpperCase()}</p></div>
              <div className="flex gap-2">
                <button title="Chat" className="icon-btn" onClick={() => startChat(user._id)}><MessageCircle size={18} /></button>
                <button title="Audio call" className="icon-btn" onClick={() => navigate(`/audio/${user._id}`)}><Phone size={18} /></button>
                <button title="Video call" className="icon-btn" onClick={() => navigate(`/video/${user._id}`)}><Video size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
