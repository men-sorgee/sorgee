import { NextApiResponse } from 'next'
declare global {
  interface NextApiResponse extends NextApiResponse {
    socket: net.Socket & {
      server: any
    }
  }

  function ga(...args: any[])
}
