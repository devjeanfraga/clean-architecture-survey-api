import { SurveyModel, LoadSurveysRepository} from "./db-load-surveys-protocols";
import { DbLoadSurveys } from "./db-load-surveys";

const listSurveys: SurveyModel[] = [
  {
    id: 'any-id',
    question: 'any-question',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
    date: new Date(),
  },
  {
    id: 'any-id',
    question: 'any-question',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
    date: new Date(),
  }
]

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadSurveys(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(listSurveys));
    }
  }
  return new LoadSurveysRepositoryStub(); 
}

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
}
const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub
  };
};

describe('DbLoadSurveys', () => {
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const spyLoadSurbeys = jest.spyOn(loadSurveysRepositoryStub, 'loadSurveys');
    await sut.load();
    expect(spyLoadSurbeys).toHaveBeenCalled();
  });

  it('Should throws if loadSurveys LoadSurveysRepository fails', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadSurveys').mockImplementationOnce(() => {throw new Error()});
    const response = sut.load();
    await expect(response).rejects.toThrow();
  });
})