import { forbidden, HttpRequest, InvalidParamError, LoadSurveyById, SurveyModel } from "./save-survey-result-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";

const fakeRequest: HttpRequest = {
  headers: '',
  body: {},
  params: {
    surveyId: 'any-id'
  },
}
const fakeSurvey: SurveyModel = {
  id: 'any-id',
  question: 'any-question',
  answers: [{answer: 'any-answer-1', image: 'any-image'}, {answer: 'any-answer-1'}],
  date: new Date() 
} 

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    load(surveyId: string): Promise<SurveyModel> {
      return Promise.resolve(fakeSurvey);
    }
  }
  return new LoadSurveyByIdStub();
};

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub
  }
}
describe('SaveSurveyResultController', () => {
  it('should call load LoadSurveyById method with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const spyLoadById = jest.spyOn(loadSurveyByIdStub, 'load');

    await sut.handle(fakeRequest); 
    expect(spyLoadById).toHaveBeenCalledWith(fakeRequest.params.surveyId);
  });

  it('should return 403 if load LoadSurveyById method return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(fakeRequest); 
    expect(response).toEqual(forbidden(new InvalidParamError('id')));
  });
});