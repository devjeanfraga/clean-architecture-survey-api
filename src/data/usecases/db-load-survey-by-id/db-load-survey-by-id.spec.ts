import { LoadSurveyByIdRepository, SurveyModel } from "./db-load-survey-by-id-protocols";
import { DbLoadSurveyById } from "./db-load-survey-by-id";

const id = 'any-id'

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById(id: string): Promise<SurveyModel> {
      return null; 
    }
  }
  return new LoadSurveyByIdRepositoryStub(); 
};

interface SutTypes {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub); 
  return {
    sut,
    loadSurveyByIdRepositoryStub
  };
};

describe('DbLoadSurveyById', () => {

  it('Should call loadById LoadSurveyByIdRepository method with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const spyLoadById = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    await sut.load(id);
    expect(spyLoadById).toHaveBeenCalledWith(id);
  });
});