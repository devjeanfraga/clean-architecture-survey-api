import { AddSurveyResultModel } from '../../../../domain/usecases/save-survey-result';

export interface SaveSurveyResultRepository {
  saveResult (data: AddSurveyResultModel): Promise<void>
}