import { SurveyModel } from "../survey-model";

export interface LoadSurveys {
  load(): Promise<SurveyModel[]>
} 