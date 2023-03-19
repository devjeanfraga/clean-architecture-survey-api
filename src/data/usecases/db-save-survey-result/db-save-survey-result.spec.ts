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

  it('Should return null if saveResult SaveSurveyResultRepository method return null', async () => {
    const {sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockReturnValueOnce(Promise.resolve(null));

    const promise = await sut.save(fakeDataSurveyResult);
    expect(promise).toBeNull(); 
  });

  it('Should throw if saveResult SaveSurveyResultRepository method throws', async () => {
    const {sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockImplementationOnce(()=> {
      throw new Error();
    });

    const promise = sut.save(fakeDataSurveyResult);
    await expect(promise).rejects.toThrow();
  });
})