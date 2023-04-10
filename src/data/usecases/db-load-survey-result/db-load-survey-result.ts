import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultBySurveyIdRepository, SurveyResultModel } from "./db-load-survey-result-protocols";

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultBySurveyIdRepository: LoadSurveyResultBySurveyIdRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
    ) {}
  
  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const surveyResult: SurveyResultModel = await this.loadSurveyResultBySurveyIdRepository.loadResult(surveyId, accountId);
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId); 
    } 
    return surveyResult; 
  }

}