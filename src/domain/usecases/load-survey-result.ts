import { SurveyResultModel } from '../models/survey-result-model'

export interface LoadSurveyResult {
  load ( surveyId: string ): Promise<SurveyResultModel>
}