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
