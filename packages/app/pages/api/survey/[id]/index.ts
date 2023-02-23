import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, Survey } from 'lib/models'
import { withMember } from 'lib/utils/server'
import { getSurvey } from 'lib/services/directus/server'

export default async function survey(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Survey>>
) {
  try {
    await withMember(req, res)
    const { id: i } = req.query
    const id = String(i)
    const survey = await getSurvey(id)

    return res.status(200).json(ApiResponse(survey))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
