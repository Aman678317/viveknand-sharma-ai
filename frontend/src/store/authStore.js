import { create } from 'zustand'
import { api } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('globaltalk:user') || 'null'),
  accessToken: localStorage.getItem('globaltalk:access') || '',
  setSession: ({ user, accessToken }) => {
    localStorage.setItem('globaltalk:user', JSON.stringify(user))
    localStorage.setItem('globaltalk:access', accessToken)
    set({ user, accessToken })
  },
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    get().setSession(data)
    return data
  },
  signup: async (payload) => {
    const { data } = await api.post('/auth/signup', payload)
    get().setSession(data)
    return data
  },
  refresh: async () => {
    try {
      const { data } = await api.post('/auth/refresh')
      get().setSession(data)
      return true
    } catch (err) {
      get().clear()
      return false
    }
  },
  logout: async () => {
    await api.post('/auth/logout').catch(() => {})
    get().clear()
  },
  clear: () => {
    localStorage.removeItem('globaltalk:user')
    localStorage.removeItem('globaltalk:access')
    set({ user: null, accessToken: '' })
  }
}))
