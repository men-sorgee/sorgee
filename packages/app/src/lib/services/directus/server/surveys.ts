import { surveys } from "lib/config";
import {
  EventDetail,
  Question,
  Survey,
  SurveyAnswer,
  UserSurvey
} from "lib/models";

import { createItem, readItem, readItems, updateItem } from "@directus/sdk";

import { getAdminClient } from "./";

export async function createSurvey(survey: Partial<Survey>): Promise<Survey> {
  const admin = await getAdminClient()
  const data = await admin.request(createItem('surveys', survey))
  return data as unknown as Survey
}

export async function getSurvey(id: string): Promise<Survey> {
  const admin = await getAdminClient()

  const survey = await admin.request(readItem('surveys', id, {
    filter: { status: { _eq: 'published' } },
    fields: [
      'id',
      'name',
      'title',
      'description',
      'type',
      'closing',
      { event: ['id', 'name'] },
      {
        questions: ['sort',
          {
            survey_questions_id: ['*']
          }
        ]
      },
    ],
    sort: [{ questions: 'sort' }],
  })
  if (!survey) return null

  return survey as Survey
}

export async function updateSurvey(id: string, survey: Partial<Survey>): Promise<Survey> {
  const admin = await getAdminClient()
  const data = await admin.request(updateItem('surveys', id, survey))
  return data as unknown as Survey
}

export async function getQuestion(id: string): Promise<Question> {
  const admin = await getAdminClient()
  const question = await admin.request(readItem('survey_questions', id))

  if (!question) return null
  return question as unknown as Question
}

export async function getUserSurveyAnswers(surveyId: string, userId: string): Promise<UserSurvey> {
  const admin = await getAdminClient()
  const survey = await getSurvey(surveyId)
  const answers = await admin.request(readItems('survey_answers', {
    filter: {
      survey: { _eq: surveyId },
      user: { _eq: userId },
    },
  }))

  const questions = survey.questions.map((q) => {
    let question = q.survey_questions_id as Question

    return {
      ...question,
      sort: q.sort,
      answer: answers.find((a: SurveyAnswer) => a.question == question.id),
    } as any
  }).sort((a, b) => a.sort - b.sort)
  return {
    ...survey,
    questions
  }
}

export async function getSurveyAnswer(surveyId: string, userId: string, questionId: string) {
  const admin = await getAdminClient()
  const answers = await admin.request(readItems('survey_answers', {
    filter: {
      survey: { _eq: surveyId },
      user: { _eq: userId },
      question: { _eq: questionId },
    },
  }))
  if (answers.length == 0) return null
  return answers[answers.length - 1] as SurveyAnswer
}

export async function setSurveyAnswer(
  survey: string,
  user: string,
  question: string,
  answer: Record<keyof Omit<SurveyAnswer, 'id' | 'survey' | 'user' | 'question'>, any>
) {
  const admin = await getAdminClient()
  const existingAnswer = await getSurveyAnswer(survey, user, question)
  if (existingAnswer) {
    return (await admin.request(updateItem('survey_answers', existingAnswer.id, {
      ...answer,
    }))) as SurveyAnswer
  } else {
    return (await admin.request(createItem('survey_answers', {
      survey,
      user,
      question,
      ...answer,
    }))) as SurveyAnswer
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
