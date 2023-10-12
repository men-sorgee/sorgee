import { Survey, SurveyQuestions } from "lib/services/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('surveys_survey_questions_pkey', ['id'], { unique: true })
@typeorm.Entity('surveys_survey_questions', { schema: 'public' })
export class SurveysSurveyQuestion {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('integer', { name: 'sort', nullable: true })
  sort: number | null

  @typeorm.ManyToOne(
    () => SurveyQuestions,
    (surveyQuestions) => surveyQuestions.surveysSurveyQuestions
  )
  @typeorm.JoinColumn([{ name: 'survey_questions_id', referencedColumnName: 'id' }])
  question: typeorm.Relation<SurveyQuestions>

  @typeorm.ManyToOne(() => Survey, (surveys) => surveys.questions)
  @typeorm.JoinColumn([{ name: 'surveys_id', referencedColumnName: 'id' }])
  survey: typeorm.Relation<Survey>
}
