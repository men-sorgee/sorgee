
import { QuestionResult, Survey } from "../entities";
import { getRepository } from "./data-source";

export async function getSurvey(id: string): Promise<Survey> {
  const repo = await getRepository(Survey)
  return await repo.findOne({
    where: { id },
  })
}

export async function getSurveyResults(surveyId: string): Promise<QuestionResult[]> {
  const repo = await getRepository(Survey)
  return await repo.query(`SELECT * FROM get_survey_results('${surveyId}')`) as QuestionResult[]
}
