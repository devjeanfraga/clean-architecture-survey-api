import { SurveyResultModel } from '../models/survey-result-model'

export interface LoadSurveyResult {
  load ( surveyId: string, accountId: string ): Promise<SurveyResultModel>
}