import { ApiResponse, Survey } from 'lib/models'
import { getSurvey } from 'lib/services/directus/server'
import { withUser } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Survey(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Survey>>
) {
  try {
    await withUser(req, res)
    const { id: i } = req.query
    const id = String(i)
    const survey = await getSurvey(id)
    if (survey == null) return res.status(404).json(ApiResponse(null))

    return res.status(200).json(ApiResponse(survey))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null, 'Unauthorized'))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
