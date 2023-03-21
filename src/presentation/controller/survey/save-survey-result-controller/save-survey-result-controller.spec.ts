import { SaveSurveyResultController } from "./save-survey-result-controller";
import { 
  forbidden, 
  HttpRequest, 
  InvalidParamError, 
  LoadSurveyById, 
  serverError, 
  SurveyModel, 
  SurveyResultModel, 
  AddSurveyResultModel, 
  SaveSurveyResult,
  ok
} from "./save-survey-result-controller-protocols";
import MockDate from 'mockdate'; 

const fakeRequest: HttpRequest = {
  body: {
    answer: 'valid-answer-2'
  },
  params: {
    surveyId: 'any-id'
  },
  accountId: 'any-accountId'
};
const inputSaveSurveyResult = {
  surveyId: 'any-id',
  accountId: 'any-accountId',
  answer: 'valid-answer-2',
  date: new Date()
}; 

const fakeSavedSurveyResult = {id: 'any-id', ...inputSaveSurveyResult}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    load(surveyId: string): Promise<SurveyModel> {
      return Promise.resolve({
        id: 'any-id',
        question: 'any-question',
        answers: [{answer: 'valid-answer-1', image: 'any-image'}, {answer: 'valid-answer-2'}],
        date: new Date()
      });
    }
  }
  return new LoadSurveyByIdStub();
};
const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: AddSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(fakeSavedSurveyResult);
    }
  }
  return new SaveSurveyResultStub();
};

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}
describe('SaveSurveyResultController', () => {

  beforeAll (()=> {
    MockDate.set(new Date());
  });

  afterAll(()=> {
    MockDate.reset(); 
  })
  
  it('should call load LoadSurveyById method with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const spyLoadById = jest.spyOn(loadSurveyByIdStub, 'load');

    await sut.handle(fakeRequest); 
    expect(spyLoadById).toHaveBeenCalledWith(fakeRequest.params.surveyId);
  });

  it('should return 403 if load LoadSurveyById method return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(null)

    const response = await sut.handle(fakeRequest); 
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if load LoadSurveyById method return fails', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(()=> {
      throw new Error(); 
    })
    const response = await sut.handle(fakeRequest); 
    expect(response).toEqual(serverError(new Error()));
  });

  it('should return 403 request answer is not equal survey answers', async () => {
    const { sut } = makeSut();
    const fakeRequestInvalidAnswer = { body: { answer: 'invalid-answer'}, params: { surveyId: 'any-id'}};
    const response = await sut.handle(fakeRequestInvalidAnswer); 
    expect(response).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('should call save SaveSurveyResult method with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const spySave = jest.spyOn(saveSurveyResultStub, 'save');

    await sut.handle(fakeRequest); 
    expect(spySave).toHaveBeenCalledWith({
      surveyId: 'any-id',
      accountId: 'any-accountId',
      answer: 'valid-answer-2',
      date: new Date()
    });
  });

  it('should return 500 if save SaveSurveyResult method fails', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(()=> {
      throw new Error(); 
    });

    const promise = await sut.handle(fakeRequest); 
    expect(promise).toEqual(serverError(new Error()));
  });

  it('should return 200 if save SaveSurveyResult method on success', async () => {
    const { sut } = makeSut();

    const promise = await sut.handle(fakeRequest); 
    expect(promise).toEqual(ok(fakeSavedSurveyResult));
  });
});