import { SurveyResultModel } from '../../../../domain/models/survey-result-model';

export interface LoadSurveyResultBySurveyIdRepository {
  loadResult (surveyId: string, accountId?: string): Promise<SurveyResultModel>
}