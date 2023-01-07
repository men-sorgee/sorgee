import { Server, Socket } from 'socket.io'

import { NextApiRequest, NextApiResponse } from 'next'

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  // It means that socket server was already initialized
  const socket = res.socket as any
  if (socket.server.io) {
    console.log('Already set up')
    res.end()
    return
  }

  const io = new Server({
    path: '/api/socket',
  })
  socket.server = io
  let users = []
  const onConnection = (socket: Socket) => {
    socket.on('createMessage', (msg) => {
      socket.broadcast.emit('newIncomingMessage', msg)
    })
    socket.on('join', (data) => {
      const user = {
        socketId: socket.id,
        coords: data,
      }

      users.push(user)

      socket.broadcast.emit('new-user', user)
      socket.emit('current-user', user)
      socket.emit('users', users)
    })

    socket.on('position-change', (data) => {
      users = users.map((u) => {
        if (u.socketId === data.socketId) {
          return data
        }
        return u
      })

      io.emit('position-change', data)
      console.log(users)
    })

    socket.on('disconnect', () => {
      users = users.filter((u) => u.socketId !== socket.id)
      socket.broadcast.emit('users', users)
    })
  }

  // Define actions inside
  io.on('connection', onConnection)

  console.log('Setting up socket')
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
