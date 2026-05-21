import { create } from 'zustand'
import { api } from '../services/api'

export const useChatStore = create((set, get) => ({
  chats: [],
  messages: {},
  activeUsers: new Set(),
  typing: {},
  loadChats: async () => {
    const { data } = await api.get('/chat')
    set({ chats: data.chats })
  },
  createChat: async (participantId) => {
    const { data } = await api.post('/chat/create', { participantId })
    await get().loadChats()
    return data.chat
  },
  loadMessages: async (chatId) => {
    const { data } = await api.get(`/chat/messages/${chatId}`)
    set((state) => ({ messages: { ...state.messages, [chatId]: data.messages } }))
  },
  addMessage: (message) => set((state) => ({
    messages: {
      ...state.messages,
      [message.chat]: [...(state.messages[message.chat] || []), message]
    }
  })),
  setTyping: (chatId, userId, value) => set((state) => ({
    typing: { ...state.typing, [`${chatId}:${userId}`]: value }
  })),
  setPresence: (userId, online) => set((state) => {
    const activeUsers = new Set(state.activeUsers)
    online ? activeUsers.add(userId) : activeUsers.delete(userId)
    return { activeUsers }
  })
}))
