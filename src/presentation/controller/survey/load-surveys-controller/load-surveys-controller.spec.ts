import { faker } from "@faker-js/faker";
import { LoadSurveysController } from "./load-survey-controller";
import { LoadSurveys, SurveyModel, serverError, ok } from "./load-surveys-controller-protocols";


const listSurveys: SurveyModel[] = [
  {
    id: 'any-id',
    question: 'any-question',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
    date: faker.date.recent(),
  },
  {
    id: 'any-id',
    question: 'any-question',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
    date: faker.date.recent(),
  }
]

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(listSurveys));
    }
  }
  return new LoadSurveysStub(); 
}

interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub
  };
};

describe('LoadSurveysContrller', () => {
  it('should call load LoadSurveys method', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const spyLoad = jest.spyOn(loadSurveysStub, 'load');
    await sut.handle();
    expect(spyLoad).toHaveBeenCalled(); 
  }); 

  it('Should return 500 if load LoadSurveys  fails', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(() => {throw new Error()});
    const response = await sut.handle();
    expect(response.statusCode).toBe(500);
    expect(response).toEqual(serverError(new Error())); 
  }); 

  it('Should return 200 if load LoadSurveys on success', async () => {
    const { sut } = makeSut();
    const response = await sut.handle();
    expect(response.statusCode).toBe(200);
    expect(response).toEqual(ok(listSurveys)); 
  }); 
}); 