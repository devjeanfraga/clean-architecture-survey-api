import { faker } from "@faker-js/faker";
import { SaveSurveyResultRepository, LoadSurveyResultBySurveyIdRepository, AddSurveyResultModel, SurveyResultModel } from "./db-save-survey-result-protocols";
import { DbSaveSurveyResult } from "./db-save-survey-result";

const fakeDataSurveyResult = {
  surveyId: 'any-surveyId',
  accountId: 'any-account-Id', 
  answer: 'any-answer', 
  date: faker.date.recent(),
}; 

const fakeSurveyResult = {
  surveyId: 'any-surveyId',
  question: 'any-question', 
  answers: [
    {
      answer: 'any-answer-1',
      image: 'any-image-1',
      count: 1,
      percent: '100%',
      isCurrentAccountAnswer: false 
    }
  ],
  date: faker.date.past()
}


const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async saveResult (data: AddSurveyResultModel): Promise<void> {
      return Promise.resolve(); 
      //return Promise.resolve({id: 'any-id',...fakeDataSurveyResult}); 

    }
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeLoadSurveyResultBySurveyIdRepository = (): LoadSurveyResultBySurveyIdRepository => {
  class LoadSurveyResultBySurveyIdRepositoryStub implements LoadSurveyResultBySurveyIdRepository {
    async loadResult(surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return Promise.resolve(fakeSurveyResult);
    }
  }
  return new LoadSurveyResultBySurveyIdRepositoryStub();
};


interface Suttypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultBySurveyIdRepositoryStub: LoadSurveyResultBySurveyIdRepository;
}
const makeSut = (): Suttypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository(); 
  const loadSurveyResultBySurveyIdRepositoryStub = makeLoadSurveyResultBySurveyIdRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultBySurveyIdRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultBySurveyIdRepositoryStub
  }
} 
describe('DbSaveSurveyResult', () => {
  it('Should call saveResult SaveSurveyResultRepository method with correct values', async () => {
    const {sut, saveSurveyResultRepositoryStub } = makeSut();
    const spySaveResult = jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult');

    await sut.save(fakeDataSurveyResult);
    expect(spySaveResult).toHaveBeenCalledWith(fakeDataSurveyResult);
  });

  // it('Should return null if saveResult SaveSurveyResultRepository method return null', async () => {
  //   const {sut, saveSurveyResultRepositoryStub } = makeSut();
  //   jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockReturnValueOnce(Promise.resolve(null));

  //   const promise = await sut.save(fakeDataSurveyResult);
  //   expect(promise).toBeNull(); 
  // });

  it('Should throw if saveResult SaveSurveyResultRepository method throws', async () => {
    const {sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockImplementationOnce(()=> {
      throw new Error();
    });

    const promise = sut.save(fakeDataSurveyResult);
    await expect(promise).rejects.toThrow();
  });

  it('Should call loadResult LoadSurveyResultBySurveyIdRepository with correct values', async () => {
    const {sut, loadSurveyResultBySurveyIdRepositoryStub} = makeSut();
    const spyLoadResult = jest.spyOn(loadSurveyResultBySurveyIdRepositoryStub, 'loadResult');
     await sut.save(fakeDataSurveyResult);
    expect(spyLoadResult).toHaveBeenCalledWith('any-surveyId', 'any-account-Id')
  });

  it('Should throw if loadResult LoadSurveyResultBySurveyIdRepository method throws', async () => {
    const {sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult').mockImplementationOnce(()=> {
      throw new Error();
    });

    const promise = sut.save(fakeDataSurveyResult);
    await expect(promise).rejects.toThrow();
  });

  it('Should return survey result if loadResult LoadSurveyResultBySurveyIdRepository on success', async () => {
    const {sut, loadSurveyResultBySurveyIdRepositoryStub} = makeSut();
    jest.spyOn(loadSurveyResultBySurveyIdRepositoryStub, 'loadResult');
     const promise = await sut.save(fakeDataSurveyResult);
    expect(promise).toEqual(fakeSurveyResult)
  });
})