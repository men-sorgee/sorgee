import { Socket } from 'socket.io'

type ChatStatus = 'online' | 'offline' | 'away'
type UserMarker = {
  userId: string
  socketId: string
  coords: [number, number]
  status: ChatStatus
  name?: string
}

const users: {
  [key: string]: UserMarker
} = {}

const listify = (u: { [key: string]: UserMarker }) => {
  const result = []
  const map = new Map()
  for (const item of Object.values(u)) {
    if (!map.has(item.socketId)) {
      map.set(item.socketId, true) // set any value to Map
      result.push(item)
    }
  }
  return result
}

const locationHandler = (socket: Socket) => {
  console.log('chatHandler init')

  socket.on('connect', (socket: Socket) => {
    const socketId = socket.id
    console.log('New Location Connection')

    socket.on('join', (user: UserMarker) => {
      console.log('join', user)

      users[socketId] = user
      console.log(users)
      socket.broadcast.emit('new-user', user)
      socket.emit('current-user', user)
      socket.emit('users', listify(users))
    })

    socket.on('position-change', (user: UserMarker) => {
      console.log('position-change', user)
      users[socketId].coords = user.coords

      socket.emit('position-change', user)
      console.log(listify(users))
    })

    socket.on('disconnecting', () => {
      console.log('disconnecting')
      delete users[socketId]
      socket.broadcast.emit('users', listify(users))
    })
  })
}

export { locationHandler }
