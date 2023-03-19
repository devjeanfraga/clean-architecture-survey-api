import { SaveSurveyResultRepository, AddSurveyResultModel, SurveyResultModel } from "./db-save-survey-result-protocols";
import { DbSaveSurveyResult } from "./db-save-survey-result";

const fakeDataSurveyResult = {
  surveyId: 'any-surveyId',
  accountId: 'any-account-Id', 
  answer: 'any-answer', 
  data: new Date(),
}; 

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async saveResult (data: AddSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve({id: 'any-id',...fakeDataSurveyResult}); 
    }
  }
  return new SaveSurveyResultRepositoryStub();
};


interface Suttypes {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}
const makeSut = (): Suttypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository(); 
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
} 
describe('DbSaveSurveyResult', () => {
  it('Should call saveResult SaveSurveyResultRepository method with correct values', async () => {
    const {sut, saveSurveyResultRepositoryStub } = makeSut();
    const spySaveResult = jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult');

    await sut.save(fakeDataSurveyResult);
    expect(spySaveResult).toHaveBeenCalledWith(fakeDataSurveyResult);
  });
})