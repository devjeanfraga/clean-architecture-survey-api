import { AddSurveyResultModel, LoadSurveyResultBySurveyIdRepository, SaveSurveyResult, SaveSurveyResultRepository, SurveyResultModel } from "./db-save-survey-result-protocols";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultBySurveyIdRepository: LoadSurveyResultBySurveyIdRepository
  ){}

  async save(data: AddSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.saveResult(data);
    return await this.loadSurveyResultBySurveyIdRepository.loadResult(data.surveyId, data.accountId);
  
  }
}