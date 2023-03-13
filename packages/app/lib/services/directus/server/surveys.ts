import { getAdminClient } from '.'
import { Question, Survey, SurveyAnswer, SurveyQuestion } from 'lib/models'

export async function getSurvey(id: string): Promise<Survey> {
  const client = await getAdminClient()

  const survey = await client.items('surveys').readOne(id, {
    filter: { status: { _eq: 'published' } },
    fields: ['*.*', 'questions.*.*'],
    sort: ['questions.sort'],
  })
  if (!survey) return null

  return survey as unknown as Survey
}

export async function getQuestion(id: string): Promise<Question> {
  const client = await getAdminClient()
  const question = await client.items('survey_questions').readOne(id)

  if (!question) return null
  return question as unknown as Question
}

export async function getSurveyAnswer(surveyId: String, userId: string, questionId: string) {
  const client = await getAdminClient()
  const { data: answers } = await client.items('survey_answers').readByQuery({
    filter: {
      survey: { _eq: surveyId },
      user: { _eq: userId },
      question: { _eq: questionId },
    },
  })
  if (answers.length == 0) return null
  return answers[answers.length - 1] as SurveyAnswer
}

export async function setSurveyAnswer(
  survey: string,
  user: string,
  question: string,
  answer: Record<keyof Omit<SurveyAnswer, 'id' | 'survey' | 'user' | 'question'>, any>
) {
  const client = await getAdminClient()
  const existingAnswer = await getSurveyAnswer(survey, user, question)
  if (existingAnswer) {
    return (await client.items('survey_answers').updateOne(existingAnswer.id, {
      ...answer,
    })) as SurveyAnswer
  } else {
    return (await client.items('survey_answers').createOne({
      survey,
      user,
      question,
      ...answer,
    })) as SurveyAnswer
  }
}
