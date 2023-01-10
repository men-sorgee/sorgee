import { NextApiRequest, NextApiResponse } from 'next'
import { getPageContentByUrl } from '../../lib/services/directus/static'

export default async function Preview(req: NextApiRequest, res: NextApiResponse) {
  // Fetch the headless CMS to check if the provided `slug` exists
  const post = await getPageContentByUrl(req.query.slug as string)

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    maxAge: Date.now() + 60 * 60, // 1 hour
    path: req.query.slug,
  })

  // Redirect to the home page
  res.writeHead(307, { Location: '/' + req.query.slug })
  res.end()
}
