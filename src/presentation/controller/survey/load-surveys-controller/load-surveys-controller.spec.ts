import { LoadSurveysController } from "./load-survey-controller";
import { LoadSurveys, SurveyModel } from "./load-surveys-controller-protocols";

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return null;
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
  it('should call load LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const spyLoad = jest.spyOn(loadSurveysStub, 'load');
    await sut.handle();
    expect(spyLoad).toHaveBeenCalled(); 
  })
}); 