import { Socket } from 'socket.io'

type ChatStatus = 'online' | 'offline' | 'away'
type User = {
  userId: string
  status: ChatStatus
  name?: string
}

const users: {
  [key: string]: User
} = {}

const chatHandler = (socket: Socket) => {
  const socketId = socket.id
  console.log('chatHandler init')
  socket.on('connect', (socket: Socket) => {
    console.log('New Chat Connection')

    socket.on('createMessage', (msg) => {
      socket.broadcast.emit('newIncomingMessage', msg)
    })

    socket.on('join', (userId: string) => {
      console.log('join', userId)
      const user: User = {
        userId,
        status: 'online',
      }

      users[socketId] = user

      socket.broadcast.emit('new-user', user)
      socket.emit('current-user', user)
      socket.emit('users', users)
    })

    socket.on('status-change', ({ status }) => {
      console.log('status-change', status)
      users[socketId].status = status

      socket.emit('status-change', users)
      socket.emit('users', users)
      console.log(users)
    })

    socket.on('disconnecting', () => {
      console.log('disconnecting')
      delete users[socketId]
      socket.broadcast.emit('users', users)
    })
  })
}

export { chatHandler }
