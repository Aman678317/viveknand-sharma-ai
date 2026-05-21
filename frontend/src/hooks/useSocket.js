import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../sockets/socketClient'

export function useSocket() {
  useEffect(() => {
    connectSocket()
    return () => disconnectSocket()
  }, [])
}
