import { faker } from '@faker-js/faker';
import {forbidden, InvalidParamError, LoadSurveyById, serverError, SurveyModel, LoadSurveyResult, SurveyResultModel, HttpRequest} from './load-survey-result-controller-protocols';
import {LoadSurveyResultController} from './load-survey-result-controller'

const fakeHttpRequest: HttpRequest = {
  accountId:'any-account-id',
  params: {
    surveyId: 'any-id'
  }
}

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

const makeLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return Promise.resolve({
        surveyId: 'any-surveyId',
        question: 'any-question', 
        answers: [
          {
            answer: 'any-answer-1',
            image: 'any-image-1',
            count: 1,
            percent: 100,
            isCurrentAccountAnswer: false 
          }
        ],
        date: faker.date.past()
      }); 
    }
  }
  return new LoadSurveyResultStub();
};

interface SutTypes {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const loadSurveyResultStub = makeLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub);
  return {
    sut,
    loadSurveyByIdStub, 
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyById with correct values',  async () => {
    const {sut, loadSurveyByIdStub} = makeSut();
    const spyLoad = jest.spyOn(loadSurveyByIdStub, 'load');
    await sut.handle(fakeHttpRequest);
    expect(spyLoad).toHaveBeenCalledWith('any-id');
  });

  it('Should return 403 if LoadSurveyById return null',  async () => {
    const {sut, loadSurveyByIdStub} = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(null);
    const promise = await sut.handle(fakeHttpRequest);
    expect(promise).toEqual(forbidden(new InvalidParamError('surveyId')))
  }); 

  it('Should retur 500 if LoadSurveyById return fails',  async () => {
    const {sut, loadSurveyByIdStub} = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(() => { throw new Error() });
    const promise = await sut.handle(fakeHttpRequest);
    expect(promise).toEqual(serverError(new Error()))
  });

  it('Should call LoadSurveyResult with correct values if LoadSurveyById on success',  async () => {
    const {sut, loadSurveyResultStub} = makeSut();
    const spyLoad = jest.spyOn(loadSurveyResultStub, 'load');
    await sut.handle(fakeHttpRequest);
    expect(spyLoad).toHaveBeenCalledWith('any-id', 'any-account-id');
  });
})