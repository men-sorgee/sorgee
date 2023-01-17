import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from 'lib/models'
import { withMethods } from 'lib/utils/server'

export default async function Revalidate(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST', 'GET'])) return

    if (req.headers.authorization !== process.env.ADMIN_TOKEN)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))

    let slug = (req.query.slug || req.body.slug) as string
    if (!slug) return res.status(400).json(ApiResponse(null, 'Missing slug'))

    if (slug.includes('index')) slug = ''

    // This should be the actual path not a rewritten path
    await res.revalidate(slug?.at(0) == '/' ? slug : '/' + slug)
    return res.json(ApiResponse({ revalidated: true }))
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send(ApiResponse(null, 'Error revalidating'))
  }
}
