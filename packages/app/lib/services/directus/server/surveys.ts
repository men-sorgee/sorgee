import { getAdminClient } from '.'
import { Survey, SurveyAnswer, SurveyQuestion } from 'lib/models'

export async function getSurvey(id: string): Promise<Survey> {
  const client = await getAdminClient()

  const survey: Survey = await client.items('surveys').readOne(id, {
    fields: ['*.*', 'questions.*.*'],
    sort: ['questions.sort'],
  })
  return survey
}
