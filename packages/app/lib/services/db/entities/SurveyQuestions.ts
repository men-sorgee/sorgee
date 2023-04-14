import * as typeorm from 'typeorm'
import { SurveyAnswers } from './SurveyAnswers'
import { DirectusUsers } from './DirectusUsers'
import { SurveysSurveyQuestions } from './SurveysSurveyQuestions'

@typeorm.Index('survey_questions_pkey', ['id'], { unique: true })
@typeorm.Entity('survey_questions', { schema: 'public' })
export class SurveyQuestions {
  @typeorm.Column('uuid', { primary: true, name: 'id' })
  id: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', {
    name: 'answer_type',
    length: 255,
    default: () => 'NULL::character varying',
  })
  answerType: string

  @typeorm.Column('character varying', {
    name: 'question',
    nullable: true,
    length: 255,
  })
  question: string | null

  @typeorm.Column('text', { name: 'context', nullable: true })
  context: string | null

  @typeorm.Column('json', { name: 'options', nullable: true, default: [] })
  options: object | null

  @typeorm.Column('character varying', {
    name: 'control',
    nullable: true,
    length: 255,
    default: () => "'input'",
  })
  control: string | null

  @typeorm.Column('integer', { name: 'number_minimum', nullable: true })
  numberMinimum: number | null

  @typeorm.Column('integer', { name: 'number_maximum', nullable: true })
  numberMaximum: number | null

  @typeorm.OneToMany(() => SurveyAnswers, (surveyAnswers) => surveyAnswers.question)
  surveyAnswers: typeorm.Relation<SurveyAnswers[]>

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: typeorm.Relation<DirectusUsers>

  @typeorm.JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: typeorm.Relation<DirectusUsers>

  @typeorm.OneToMany(
    () => SurveysSurveyQuestions,
    (surveysSurveyQuestions) => surveysSurveyQuestions.surveyQuestions
  )
  surveysSurveyQuestions: typeorm.Relation<SurveysSurveyQuestions[]>
}
