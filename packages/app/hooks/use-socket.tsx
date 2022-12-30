import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ReactNode } from 'react'

type Context = {
  socket: Socket
  disconnect: () => void
}
const SocketContext = createContext<Context>(undefined)

export const SocketProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const socketRef = useRef<Socket>()

  useEffect(() => {
    connectSocket()
  }, [])

  const connectSocket = () => {
    socketRef.current = io('/api/socket')
  }
  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.emit('disconnect')
    }
  }
  const context = {
    socket: socketRef.current,
    disconnect: disconnectSocket,
  }
  return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
export default SocketProvider
