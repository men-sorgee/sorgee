import { getAdminClient } from '.'
import { Survey, SurveyAnswer, SurveyQuestion } from 'lib/models'

export async function getSurvey(id: string): Promise<Survey> {
  const client = await getAdminClient()

  const survey = await client.items('surveys').readOne(id, {
    fields: ['*.*', 'questions.*.*'],
    sort: ['questions.sort'],
  })
  if (!survey) return null

  return survey as unknown as Survey
}

export async function getUserSurvey(surveyId: String, userId: string) {
  const client = await getAdminClient()
  const { data } = await client.items('survey_answers').readByQuery({
    filter: {
      survey: { _eq: surveyId },
      user: { _eq: userId },
    },
    fields: ['*.*' as any, 'survey.*', 'questions.*', 'questions.question.*'],
  })
  return data as unknown as SurveyAnswer[]
}
