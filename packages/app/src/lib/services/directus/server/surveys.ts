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

export async function getSurvey(id: string): Promise<Survey> {
  const admin = getAdminClient()

  return admin.request<Survey>(readItem('surveys', id, {
    fields: [
      'id',
      'name',
      'title',
      'description',
      'type',
      'closing',
      { event: ['id', 'name'] },
      { questions: ['sort', { survey_questions_id: ['*'] }] },
    ],
    deep: {
      questions: {
        sort: ['sort'],
      }
    },
  }))
}

export async function updateSurvey(id: string, survey: Partial<Survey>): Promise<Survey> {
  const admin = getAdminClient()
  const data = await admin.request<Survey>(updateItem('surveys', id, survey))
  return data
}

export async function createSurvey(survey: Partial<Survey>): Promise<Survey> {
  const admin = getAdminClient()
  return admin.request<Survey>(createItem('surveys', survey)) as unknown as Survey
}



export async function getQuestion(id: string): Promise<Question> {
  const admin = getAdminClient()
  const question = await admin.request<Question>(readItem('survey_questions', id))

  if (!question) return null
  return question
}

export async function getUserSurveyAnswers(surveyId: string, userId: string): Promise<UserSurvey> {
  const admin = getAdminClient()
  const survey = await getSurvey(surveyId)
  const answers = await admin.request<SurveyAnswer[]>(readItems('survey_answers', {
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
  } as UserSurvey
}

export async function getSurveyAnswer(surveyId: string, userId: string, questionId: string) {
  const admin = getAdminClient()
  const answers = await admin.request<SurveyAnswer[]>(readItems('survey_answers', {
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
  const admin = getAdminClient()
  const existingAnswer = await getSurveyAnswer(survey, user, question)
  if (existingAnswer) {
    return (await admin.request<SurveyAnswer>(updateItem('survey_answers', existingAnswer.id, {
      ...answer,
    }))) as SurveyAnswer
  } else {
    return (await admin.request<SurveyAnswer>(createItem('survey_answers', {
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
