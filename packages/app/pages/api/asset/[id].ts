import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl, adminBaseUrl } from 'lib/config'
import app from 'lib/config/server'
export default async function Asset(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, fit = 'cover', width, height, quality = '70' } = req.query
    const { referer } = req.headers

    if (!referer || !referer.startsWith(baseUrl)) return res.status(404).end()

    const url = `${adminBaseUrl}/assets/${id}?fit=${fit}${width ? '&width=' + width : ''}${
      height ? '&height=' + height : ''
    }&quality=${quality}&access_token=${app.adminToken}`

    const response = await fetch(url, { cache: 'force-cache' })
    if (response.ok) {
      response.arrayBuffer().then((buffer) => {
        res
          .setHeader('Content-Type', response.headers.get('Content-Type'))
          .setHeader('Content-Length', response.headers.get('Content-Length'))
          .setHeader('Content-Disposition', response.headers.get('Content-Disposition'))
          .setHeader('cache', response.headers.get('cache'))
          .status(response.status)
          .send(Buffer.from(buffer))
      })
    } else {
      res.status(404).end()
    }
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}
