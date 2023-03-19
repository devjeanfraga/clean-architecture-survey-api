import { AddSurveyResultModel } from '../../../../domain/usecases/save-survey-result';
import { SurveyResultModel } from '../../../../domain/models/survey-result-model';

export interface SaveSurveyResultRepository {
  saveResult (data: AddSurveyResultModel): Promise<SurveyResultModel>
}