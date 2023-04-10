import { SurveyResultModel } from "../../../usecases/db-save-survey-result/db-save-survey-result-protocols";

export interface LoadSurveyResultRepository {
  loadBySurveyId (surveyId: string): Promise<SurveyResultModel>
}