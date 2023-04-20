import { Server } from 'socket.io'
import { Message } from 'lib/models'

const SocketHandler = (req, res) => {
  let io = null
  if (res.socket.server.io) {
    io = res.socket.server.io
    console.log('sockets are already running')
  } else {
    console.log('socket is initializing')
    io = new Server(res.socket.server, {
      cors: {
        origin: '*',
      },
      addTrailingSlash: false,
      path: '/api/socket.io',
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      let userId = null
      socket.on('join', (id: string) => {
        userId = id
        socket.join(userId)
        socket.emit('user-joined', userId)
      })

      socket.on('user-typing', (msg: { to: string; from: string }) => {
        if (msg.to) {
          socket.to(msg.to).emit('user-typing', msg.from)
        }
      })

      socket.on('send-message', (msg: Message) => {
        if (msg.to) {
          socket.to(msg.to as string).emit('receive-message', msg)
        }
      })

      socket.on('disconnect', () => {
        socket.leave(userId)
        socket.emit('user-left', userId)
      })
    })
  }
  res.end()
}
export default SocketHandler
