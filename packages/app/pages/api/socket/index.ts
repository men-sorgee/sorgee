import { Server, Socket } from 'socket.io'
import { chatHandler } from 'lib/services/chat/chatHandler'
import { locationHandler } from 'lib/services/location/locationHandler'
export default function SocketHandler(_, res) {
  // It means that socket server was already initialized
  const socket = res.socket as any
  if (socket.server.io) {
    console.log('Socket already set up')
    res.end()
    return
  }

  const io = new Server(res.socket.server)
  // @ts-ignore
  res.socket.server.io = io

  const onConnection = (socket: Socket) => {
    console.log('New connection')
    chatHandler(socket)
    locationHandler(socket)
  }

  // Define actions inside
  io.on('connection', onConnection)

  console.log('Socket set up')
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
