import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, SurveyAnswer } from 'lib/models'
import { withMember, withMethods } from 'lib/utils/server'
import { getSurveyAnswer, setSurveyAnswer } from 'lib/services/directus/server'

export default async function survey(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SurveyAnswer>>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const member = await withMember(req, res)
    const { id: i, question: q } = req.query
    const survey_id = String(i)
    const question_id = String(q)

    switch (method) {
      case 'GET': {
        //const survey = await getSurvey(survey_id)
        const answer = await getSurveyAnswer(survey_id, member.id, question_id)
        if (!answer) {
          return res.status(200).json(
            ApiResponse<SurveyAnswer>({
              survey: survey_id,
              user: member.id,
              question: question_id,
            })
          )
        } else {
          return res.status(200).json(ApiResponse(answer))
        }
      }
      case 'POST': {
        const answerData = req.body
        const answer = await setSurveyAnswer(survey_id, member.id, question_id, answerData)
        return res.status(200).json(ApiResponse(answer))
      }
    }
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
