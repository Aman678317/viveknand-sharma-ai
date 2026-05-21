import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Phone, Send, Video } from 'lucide-react'
import { getSocket } from '../sockets/socketClient'
import { useChatStore } from '../store/chatStore'

export default function ChatPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const bottomRef = useRef(null)
  const [text, setText] = useState('')
  const { messages, chats, loadMessages, loadChats } = useChatStore()
  const socket = useMemo(() => getSocket(), [])
  const chatMessages = messages[id] || []
  const chat = chats.find((item) => item._id === id)
  const peer = chat?.participants?.find((p) => p._id !== JSON.parse(localStorage.getItem('globaltalk:user') || '{}')._id)

  useEffect(() => { loadChats(); loadMessages(id); socket.emit('join-chat', { chatId: id }) }, [id, loadChats, loadMessages, socket])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages.length])

  function send() {
    if (!text.trim()) return
    socket.emit('send-message', { chatId: id, content: text }, () => {})
    socket.emit('typing-stop', { chatId: id })
    setText('')
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <header className="flex items-center justify-between border-b border-white/10 p-4">
        <div><h2 className="font-semibold">{peer?.fullName || 'Conversation'}</h2><p className="text-xs text-slate-400">Original and translated messages are stored for auditability.</p></div>
        <div className="flex gap-2">
          <button className="icon-btn" title="Audio call" onClick={() => peer && navigate(`/audio/${peer._id}`)}><Phone size={18} /></button>
          <button className="icon-btn" title="Video call" onClick={() => peer && navigate(`/video/${peer._id}`)}><Video size={18} /></button>
        </div>
      </header>
      <section className="space-y-3 overflow-y-auto p-4">
        {chatMessages.map((message) => (
          <article key={message._id} className="max-w-2xl rounded-lg bg-slate-900 p-3">
            <p className="text-sm text-white">{message.originalContent}</p>
            {message.translatedContent && <p className="mt-2 border-t border-white/10 pt-2 text-sm text-cyan-200">{message.translatedContent}</p>}
            <p className="mt-2 text-xs text-slate-500">{message.sourceLanguage} → {message.targetLanguage} · {message.status}</p>
          </article>
        ))}
        <div ref={bottomRef} />
      </section>
      <footer className="flex gap-3 border-t border-white/10 p-4">
        <input
          className="field"
          placeholder="Message across languages"
          value={text}
          onChange={(e) => { setText(e.target.value); socket.emit('typing-start', { chatId: id }) }}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-400 text-slate-950" title="Send" onClick={send}><Send size={20} /></button>
      </footer>
    </div>
  )
}
