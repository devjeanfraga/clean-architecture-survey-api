import {forbidden, InvalidParamError, LoadSurveyById, serverError, SurveyModel} from './load-survey-result-controller-protocols';
import {LoadSurveyResultController} from './load-survey-result-controller'

const fakeHttpRequest = {
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

interface SutTypes {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyById with correct values',  async () => {
    const {sut, loadSurveyByIdStub} = makeSut();
    const spyLoadById = jest.spyOn(loadSurveyByIdStub, 'load');
    await sut.handle(fakeHttpRequest);
    expect(spyLoadById).toHaveBeenCalledWith('any-id');
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

})