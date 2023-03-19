import { SurveyModel } from "../models/survey-model";

export interface LoadSurveyById {
  load (surveyId: string): Promise<SurveyModel>
}