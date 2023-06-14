import * as typeorm from 'typeorm'

import { DirectusFile } from './DirectusFiles'
import { SurveyQuestions } from './SurveyQuestions'
import { Surveys } from './Surveys'
import { User } from './User'

@typeorm.Index('survey_answers_pkey', ['id'], { unique: true })
@typeorm.Entity('survey_answers', { schema: 'public' })
export class SurveyAnswers {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'answer_text',
    nullable: true,
    length: 255,
  })
  answerText: string | null

  @typeorm.Column('integer', {
    name: 'answer_number',
    nullable: true,
    default: () => '0',
  })
  answerNumber: number | null

  @typeorm.Column('boolean', { name: 'answer_boolean', nullable: true })
  answerBoolean: boolean | null

  @typeorm.Column('text', { name: 'answer_context', nullable: true })
  answerContext: string | null

  @typeorm.Column('json', { name: 'answer_choose', nullable: true, default: [] })
  answerChoose: object | null

  @typeorm.Column('timestamp with time zone', { name: 'answer_date', nullable: true })
  answerDate: Date | null

  @typeorm.JoinColumn([{ name: 'answer_file', referencedColumnName: 'id' }])
  answerFile: typeorm.Relation<DirectusFile>

  @typeorm.JoinColumn([{ name: 'answer_image', referencedColumnName: 'id' }])
  answerImage: typeorm.Relation<DirectusFile>

  @typeorm.ManyToOne(() => SurveyQuestions, (surveyQuestions) => surveyQuestions.surveyAnswers)
  @typeorm.JoinColumn([{ name: 'question', referencedColumnName: 'id' }])
  question: typeorm.Relation<SurveyQuestions>

  @typeorm.ManyToOne(() => Surveys, (surveys) => surveys.surveyAnswers, {
    onDelete: 'SET NULL',
  })
  @typeorm.JoinColumn([{ name: 'survey', referencedColumnName: 'id' }])
  survey: typeorm.Relation<Surveys>

  @typeorm.ManyToOne(() => User, (users) => users.surveyAnswers, {
    onDelete: 'SET NULL',
  })
  @typeorm.JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>
}
