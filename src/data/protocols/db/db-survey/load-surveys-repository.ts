import { SurveyModel } from "../../../usecases/db-load-surveys-protocols";

export interface LoadSurveysRepository {
  loadSurveys(): Promise<SurveyModel[]>;
}