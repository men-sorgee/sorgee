import { NextApiRequest, NextApiResponse } from 'next'

export default async function getAsset(req: NextApiRequest, res: NextApiResponse) {
  let id = req.query.id
  //const { referer } = req.headers;
  //if (!referer || !referer.startsWith(adminBaseUrl))
  //  return res.status(404).end();
  if (id == 'null') id = 'b063b5ac-fcec-46ae-8225-bbfb4a0184b5'

  // TODO: add content policy protection
  const url = `${process.env.ADMIN_URL}/assets/${id}?fit=cover&access_token=${process.env.ADMIN_TOKEN}`

  const response = await fetch(url)
  res.setHeader('cache', 'public, max-age=31536000, immutable')
  res.status(response.status).send(response.body)
}
