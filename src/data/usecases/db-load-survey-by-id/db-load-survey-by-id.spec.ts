import { LoadSurveyByIdRepository, SurveyModel } from "./db-load-survey-by-id-protocols";
import { DbLoadSurveyById } from "./db-load-survey-by-id";

const id = 'any-id'
const fakeSurvey: SurveyModel = {
  id: 'any-id',
  question: 'any-question',
  answers: [{answer: 'any-answer-1', image: 'any-image'}, {answer: 'any-answer-1'}],
  date: new Date() 
} 


const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(fakeSurvey); 
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

  it('Should return null if loadById LoaSurveyByIdRepository method returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));

    const promise = await sut.load(id);
    expect(promise).toBeNull();
  });

  it('Should throw if loadById LoaSurveyByIdRepository method throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(()=> {
      throw new Error();
    });

    const promise = sut.load(id);
    await expect(promise).rejects.toThrow();
  });

  it('Should return a survey if loadById LoaSurveyByIdRepository method on success', async () => {
    const { sut } = makeSut();
    const survey = await sut.load(id);
    expect(survey).toEqual(fakeSurvey);
  });
});