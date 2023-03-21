import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'

export default async function getAsset(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, fit = 'cover', width, height, quality = '80' } = req.query
    const { referer } = req.headers

    if (!referer || !referer.startsWith(baseUrl)) return res.status(404).end()

    // TODO: add content policy protection
    const url = `${process.env.ADMIN_URL}/assets/${id}?fit=${fit}${width ? '&width=' + width : ''}${
      height ? '&height=' + height : ''
    }&quality=${quality}&access_token=${process.env.ADMIN_TOKEN}`

    const response = await fetch(url)
    res.setHeader('cache', 'public, max-age=31536000, immutable')
    res.status(response.status).send(response.body)
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}
