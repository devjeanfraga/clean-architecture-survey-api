import { SurveyResultModel } from "../models/survey-result-model";

export type AddSurveyResultModel = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResult {
  save ( data: AddSurveyResultModel ): Promise<SurveyResultModel>
}