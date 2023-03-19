import { LoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from "../db-load-survey-by-id/db-load-survey-by-id-protocols";

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyById: LoadSurveyByIdRepository
  ){}
  
  async load(surveyId: string): Promise<SurveyModel> {
    await this.loadSurveyById.loadById(surveyId);
    return null; 
  }
}