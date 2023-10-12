import { ApiResponse, ApiResponseType, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Revalidate(req: NextApiRequest, res: NextApiResponse<ApiResponseType>) {
  try {
    withMethods(req, ['POST', 'GET'])

    if (req.headers.authorization !== process.env.ADMIN_TOKEN)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))

    let s = req.query.slug || (req.body.slug as string[])
    if (!s) return res.status(400).json(ApiResponse(null, 'Missing slug'))
    let slug = '/' + (Array.isArray(s) ? s[s.length - 1] : s).replace('index', '')

    // This should be the actual path not a rewritten path
    await res.revalidate(slug)

    return res.json(ApiResponse({ revalidated: true }))
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send(ApiResponse(null, 'Error revalidating'))
  }
}
