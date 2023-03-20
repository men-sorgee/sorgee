import http from 'http'
import next from 'next'
import initSocketIO from '../pages/api/socket'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res)
  })

  // Attach socket.io to the HTTP server
  initSocketIO(server)

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
