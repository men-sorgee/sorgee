
import { Question } from "lib/models";
import { SurveyResult } from "lib/db/entities";
import { getSurveyResults } from "lib/db/server";
import { getSurvey } from "lib/services/directus/server";
import { ApiResponse, ApiResponseType, withMember } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function UserSurvey(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<SurveyResult>>
) {
  try {
    await withMember(req, res)

    const { id: i } = req.query
    const id = String(i)

    const survey = await getSurvey(id)
    const results = await getSurveyResults(id)

    const enrichedResults = results.map(result => {
      const { survey_questions_id, sort } = survey.questions.find(({ survey_questions_id: question }: { survey_questions_id: Question }) => question.id === result.question_id)
      let question = survey_questions_id as Question
      return {
        ...result,
        question: question.question,
        sort: sort,
      }
    })
    const result: SurveyResult = {
      name: survey.name,
      id: survey.id,
      questions: enrichedResults.sort((a, b) => a.sort - b.sort),
    }

    return res.status(200).json(ApiResponse(result))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null, 'Unauthorized'))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
