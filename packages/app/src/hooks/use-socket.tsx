
import { EventEmitter } from "lib/utils/event-emitter";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

const messages = new EventEmitter()

export type SocketContext = {
  socket: WebSocket
  messages: EventEmitter
}

export const SocketContext = createContext<SocketContext>({
  socket: undefined,
  messages: undefined
})

export type SocketProviderProps = {
  url?: string
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  reconnect?: boolean
  children?: ReactNode
}

export const SocketProvider = ({
  children,
  url = '/api/ws',
  onOpen = () => console.log('ws:open'),
  onClose = () => console.log('ws:close'),
  onError = (err) => console.error('ws:error', err),
  reconnect
}: SocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket>(undefined)
  const [messages, setMessages] = useState<EventEmitter>(undefined)

  const socketOnMessage = useCallback((event) => {
    console.log('ws:message')
    console.dir(event.data)
    messages.emit(event.topic, event.data)
  }, [messages])

  const registerListeners = useCallback((ws: WebSocket) => {
    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', (e: CloseEvent) => {
      if (reconnect) {
        setTimeout(() => {
          const socket = new WebSocket(url)
          setSocket(socket)
          registerListeners(socket)
        }, 1000)
      }
      onClose(e)
    })
    ws.addEventListener('error', onError)
    ws.addEventListener('message', socketOnMessage)
    return () => {
      ws.removeEventListener('open', onOpen)
      ws.removeEventListener('close', onClose)
      ws.removeEventListener('error', onError)
      ws.removeEventListener('message', socketOnMessage)
      ws.close()
    }
  }, [onClose, onError, onOpen, reconnect, socketOnMessage, url])

  useEffect(() => {
    const ws = new WebSocket(url)
    const ee = new EventEmitter()
    setSocket(ws)
    setMessages(ee)
    return registerListeners(ws)

  }, [registerListeners, url])

  return (<SocketContext.Provider value={{
    socket,
    messages: new EventEmitter()
  }}> {children}</SocketContext.Provider >)
}

export const useSocket = () => {
  const { socket, messages } = useContext(SocketContext)
  return { socket, messages }
}
