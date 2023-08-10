import { create } from "domain";
import { surveys } from "lib/config";
import {
  EventDetail,
  GroupEvent,
  Question,
  Survey,
  SurveyAnswer,
  UserSurvey
} from "lib/models";

import { getAdminClient } from "./";

export async function createSurvey(survey: Partial<Survey>): Promise<Survey> {
  const client = await getAdminClient()
  const data = await client.items('surveys').createOne(survey)
  return data as unknown as Survey
}

export async function getSurvey(id: string): Promise<Survey> {
  const client = await getAdminClient()

  const survey = await client.items('surveys').readOne(id, {
    filter: { status: { _eq: 'published' } },
    fields: [
      'id',
      'name',
      'title',
      'description',
      'type',
      'closing',
      'event.*',
      'questions.survey_questions_id.*',
      'questions.sort',
    ],
    sort: ['questions.sort'],
  })
  if (!survey) return null

  return survey as Survey
}

export async function updateSurvey(id: string, survey: Partial<Survey>): Promise<Survey> {
  const client = await getAdminClient()
  const data = await client.items('surveys').updateOne(id, survey)
  return data as unknown as Survey
}

export async function getQuestion(id: string): Promise<Question> {
  const client = await getAdminClient()
  const question = await client.items('survey_questions').readOne(id)

  if (!question) return null
  return question as unknown as Question
}

export async function getUserSurveyAnswers(surveyId: string, userId: string): Promise<UserSurvey> {
  const client = await getAdminClient()
  const survey = await getSurvey(surveyId)
  const { data: answers } = await client.items('survey_answers').readByQuery({
    filter: {
      survey: { _eq: surveyId },
      user: { _eq: userId },
    },
  })

  const questions = survey.questions.map((q) => {
    let question = q.survey_questions_id as Question

    return {
      ...question,
      sort: q.sort,
      answer: answers.find((a) => a.question == question.id),
    }
  })
  return {
    ...survey,
    questions: questions.sort((a, b) => a.sort - b.sort)
  }
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

export async function createEventSurvey(event: EventDetail) {
  const template = surveys.event
  const survey: Partial<Survey> = {
    name: template.name.replace('$EVENT$', event.name),
    title: template.title.replace('$EVENT$', event.name),
    description: template.description.replace('$EVENT$', event.name),
    type: template.type as any,
    closing: template.closing,
    event: event.id,
    questions: template.questions.map((q, i) => ({
      survey_questions_id: q,
      sort: i,
    })),
    status: 'published',
  }
  return await createSurvey(survey)
}
