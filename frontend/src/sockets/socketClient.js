import { io } from 'socket.io-client'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'

let socket

export function getSocket() {
  const token = useAuthStore.getState().accessToken
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
      auth: { token },
      autoConnect: false,
      transports: ['websocket', 'polling']
    })
    socket.on('receive-message', (message) => useChatStore.getState().addMessage(message))
    socket.on('typing-start', ({ chatId, userId }) => useChatStore.getState().setTyping(chatId, userId, true))
    socket.on('typing-stop', ({ chatId, userId }) => useChatStore.getState().setTyping(chatId, userId, false))
    socket.on('user-online', ({ userId }) => useChatStore.getState().setPresence(userId, true))
    socket.on('user-offline', ({ userId }) => useChatStore.getState().setPresence(userId, false))
  }
  socket.auth = { token }
  return socket
}

export function connectSocket() {
  const client = getSocket()
  if (!client.connected) client.connect()
  return client
}

export function disconnectSocket() {
  socket?.disconnect()
}
