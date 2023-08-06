import { adminBaseUrl, baseUrl } from "lib/config";
import app from "lib/config/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Asset(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, fit = 'cover', width, height, quality = '70' } = req.query
    const { referer } = req.headers

    if (!referer || !referer.startsWith(baseUrl)) return res.status(404).end()

    const url = `${adminBaseUrl}/assets/${id}?fit=${fit}${width ? '&width=' + width : ''}${height ? '&height=' + height : ''
      }&quality=${quality}&access_token=${app.adminToken}`

    let response = await fetch(url, { cache: 'force-cache', keepalive: true })
    if (response.ok) {
      return await proxyCachedResponse(res, response)
    } else if (response.status > 500) {
      response = await fetch(`${adminBaseUrl}/assets/${id}`)
      if (response.ok)
        return await proxyCachedResponse(res, response)
    }
    return res.status(404).end()

  } catch (err) {
    console.error(err)
    res.status(500)
  }
}

const proxyCachedResponse = async (res: NextApiResponse, response: Response) => {
  const buffer = await response.arrayBuffer()
  res
    .setHeader('Content-Type', response.headers.get('Content-Type'))
    .setHeader('Content-Length', response.headers.get('Content-Length'))
    .setHeader('Content-Disposition', response.headers.get('Content-Disposition'))
    .setHeader('Cache-Control', response.headers.get('Cache-Control'))
    .setHeader('Last-Modified', response.headers.get('Last-Modified'))
    .setHeader('Expires', response.headers.get('Expires'))
    .status(response.status)
    .send(Buffer.from(buffer))
}

export const config = {
  api: {
    bodyParser: false,
  },
}
