import { SurveyModel } from "../db-load-surveys/db-load-surveys-protocols";
import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultBySurveyIdRepository, SurveyResultModel } from "./db-load-survey-result-protocols";

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultBySurveyIdRepository: LoadSurveyResultBySurveyIdRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
    ) {}
  
  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    let surveyResult: SurveyResultModel = await this.loadSurveyResultBySurveyIdRepository.loadResult(surveyId, accountId);
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId); 
      surveyResult = this.makeVoidSurveyResult(survey);
    } 
    return surveyResult; 
  }

  private makeVoidSurveyResult ( survey: SurveyModel ): SurveyResultModel {
    return {
      surveyId: survey.id,
      question: survey.question, 
      date:survey.date,
      answers: survey.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false 
      }))
    }
  }

}