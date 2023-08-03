import { SurveyAnswer } from 'lib/models'
import { ApiResponse } from 'lib/utils'
import { getQuestion, getSurveyAnswer, setSurveyAnswer } from 'lib/services/directus/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function SurveyQuestion(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SurveyAnswer>>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const member = await withMember(req, res)
    const { id: i, qid: q } = req.query
    const survey_id = String(i)
    const question_id = String(q)

    switch (method) {
      case 'GET': {
        const question = await getQuestion(question_id)
        const answer = await getSurveyAnswer(survey_id, member.id, question_id)
        if (!answer) {
          return res.status(200).json(
            ApiResponse<SurveyAnswer>({
              survey: survey_id,
              user: member.id,
              question: question_id,
              answer_choose:
                question.control == 'range'
                  ? [question.number_minimum, question.number_maximum]
                  : [],
            })
          )
        } else {
          return res.status(200).json(ApiResponse(answer))
        }
      }
      case 'POST': {
        const { answer_text, answer_boolean, answer_number, answer_context, answer_choose } =
          req.body

        const answer = await setSurveyAnswer(survey_id, member.id, question_id, {
          answer_text,
          answer_boolean,
          answer_number,
          answer_context,
          answer_choose,
        })
        return res.status(200).json(ApiResponse(answer))
      }
    }
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
