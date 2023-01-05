import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ReactNode } from 'react'

type Context = {
  socket: Socket
  connected: boolean
  connect: () => void
  disconnect: () => void
}
export const SocketContext = createContext<Context>(undefined)

export const SocketProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket>()

  const connectSocket = () => {
    socketRef.current = io('/api/socket')
    setConnected(true)
  }
  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.emit('disconnect')
    }
    setConnected(false)
  }
  const context = {
    socket: socketRef.current,
    connected,
    disconnect: disconnectSocket,
    connect: connectSocket,
  }
  return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
}
export const useSocket = () => useContext(SocketContext)
export default SocketProvider
