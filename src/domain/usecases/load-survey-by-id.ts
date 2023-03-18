import { SurveyModel } from "../models/survey-model";

export interface LoadSurveyById {
  loadById (surveyId: string): Promise<SurveyModel>
}