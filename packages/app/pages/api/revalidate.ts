import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from 'lib/models'
import { withMethods } from 'lib/utils/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST', 'GET'])) return

    if (req.headers.authorization !== process.env.ADMIN_TOKEN)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))

    const slug = req.query.slug || req.body.slug

    // This should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate(slug || '/')
    return res.json(ApiResponse({ revalidated: true }))
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send(ApiResponse(null, 'Error revalidating'))
  }
}
