import { User } from 'next-auth'

import { DirectusUser } from './directus'
import { GroupEvent } from './events'

export type Rating = {
  id: string
  date_created?: string
  date_updated?: string
  user?: string | User
  collection: RatingCollection
  event?: string | GroupEvent
  member?: string | User
  rate: number
}

export type RatingCollection = 'users' | 'events' | 'photo' | 'location'

export type Survey = {
  id: string
  status: string
  type: 'event' | 'user' | 'location' | 'generic'
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  name: string
  title: string
  description?: string
  closing?: string
  notification?: string | Notification
  questions: Array<SurveyQuestion>
  location?: string | Location
  event?: string | GroupEvent
}

export type SurveyQuestion = {
  id: number
  surveys_id?: string | Survey
  survey_questions_id: string | Question
  sort?: number
}
export type AnswerType =
  | 'string'
  | 'number'
  | 'text'
  | 'boolean'
  | 'string_array'
  | 'number_array'
  | 'date'
  | 'file'
  | 'image'
  | 'email'
  | 'url'
  | 'tel'
  | 'password'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color'
export type AnswerControlType =
  | 'input'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxes'
  | 'rating'
  | 'range'
  | 'textarea'
  | 'switch'
  | 'date'
  | 'image'
  | 'file'
export type Question = {
  id: string
  control: AnswerControlType
  answer_type: AnswerType
  number_minimum?: number
  number_maximum?: number
  question: string
  context?: string
  options?: Array<{ name: string; value: string }>
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
}

export type SurveyAnswer = {
  id?: string
  user: string
  survey: string
  question: string
  answer_text?: string
  answer_number?: number
  answer_boolean?: boolean
  answer_context?: string
  answer_choose?: any[]
}
