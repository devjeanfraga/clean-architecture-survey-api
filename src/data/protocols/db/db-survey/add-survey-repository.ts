import { AddSurveyModel } from "../../../../domain/usecases/add-survey"

export interface AddSurveyRepository {
  addSurvey (dataSurvey: AddSurveyModel): Promise<void>;
}