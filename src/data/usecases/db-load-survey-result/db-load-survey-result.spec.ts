import { LoadSurveyResultRepository, SurveyResultModel } from "./db-load-survey-result-protocols";
import { DbLoadSurveyResult } from './db-load-survey-result';

const makeloadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string ): Promise<SurveyResultModel> {
      return null; 
    }
  }
  return new LoadSurveyResultRepositoryStub();
};

interface SutTypes {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeloadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return {
    sut,
    loadSurveyResultRepositoryStub
  } 
};

describe('DbLoadSurveyResult Usecase', () => {

  it ('Should call loadBySurveyId LoadSurveyResultRepository method with correct values', async ()  => {
    const {sut, loadSurveyResultRepositoryStub } = makeSut();
    const spyloadBySurveyId = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any-survey-id');
    expect(spyloadBySurveyId).toHaveBeenCalledWith('any-survey-id');
  });
});