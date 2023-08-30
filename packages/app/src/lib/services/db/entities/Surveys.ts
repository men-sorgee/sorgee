import * as typeorm from "typeorm";

import { DirectusUsers } from "./DirectusUsers";
import { Events } from "./Events";
import { Location } from "./Location";
import { Notifications } from "./Notifications";
import { SurveyAnswers } from "./SurveyAnswers";
import { SurveysSurveyQuestion } from "./SurveysSurveyQuestions";

@typeorm.Index('surveys_pkey', ['id'], { unique: true })
@typeorm.Entity('surveys', { schema: 'public' })
export class Survey {
  @typeorm.Column('uuid', { primary: true, name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'status',
    length: 255,
    default: () => "'draft'",
  })
  status: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null

  @typeorm.Column('character varying', { name: 'title', nullable: true, length: 255 })
  title: string | null

  @typeorm.Column('character varying', {
    name: 'type',
    nullable: true,
    length: 255,
    default: () => "'generic'",
  })
  type: string | null

  @typeorm.Column('text', { name: 'description', nullable: true })
  description: string | null

  @typeorm.Column('text', { name: 'closing', nullable: true })
  closing: string | null

  @typeorm.OneToMany(() => SurveyAnswers, (surveyAnswers) => surveyAnswers.survey)
  answers: typeorm.Relation<SurveyAnswers[]>

  @typeorm.ManyToOne(() => Events, (events) => events.surveys, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn([{ name: 'event', referencedColumnName: 'id' }])
  event: typeorm.Relation<Events>

  @typeorm.ManyToOne(() => Location, (location) => location.surveys, {
    onDelete: 'SET NULL',
  })
  @typeorm.JoinColumn([{ name: 'location', referencedColumnName: 'id' }])
  location: typeorm.Relation<Location>

  @typeorm.ManyToOne(() => Notifications, (notifications) => notifications.surveys, {
    onDelete: 'SET NULL',
  })
  @typeorm.JoinColumn([{ name: 'notification', referencedColumnName: 'id' }])
  notification: typeorm.Relation<Notifications>

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: DirectusUsers

  @typeorm.JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: typeorm.Relation<DirectusUsers>

  @typeorm.OneToMany(
    () => SurveysSurveyQuestion,
    (surveysSurveyQuestions) => surveysSurveyQuestions.survey
  )
  questions: typeorm.Relation<SurveysSurveyQuestion[]>
}

export type QuestionResult = {
  question_id: string
  question_type: 'text' | 'string' | 'boolean' | 'string_array' | 'number' | 'number_array' | 'file' | 'color'
  aggregated_result: string
  question?: string
  order: number
}

export type SurveyResult = {
  id: string
  name: string
  questions: QuestionResult[]
}
