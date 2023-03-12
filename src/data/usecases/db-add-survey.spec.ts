import { DbAddSurvey } from "./db-add-survey";
import { AddSurveyRepository, AddSurveyModel} from "./db-add-survey-protocols";

const dataSurvey = {
  question: 'any-question',
  answers: [
    { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
    { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
    { answer: 'any-answer-03'}
  ],
  date: 'any-date'
}; 

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    addSurvey(dataSurvey: AddSurveyModel): Promise<void> {
      return null; 
    }
  }
  return new AddSurveyRepositoryStub();
};

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository; 
}
const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub
  }
};

describe('DbAddSurvey', () => {
  it('Should add AddSurveyRepository with correct values', async () => {
    const {sut, addSurveyRepositoryStub} = makeSut();
    const spyAddSurvey = jest.spyOn(addSurveyRepositoryStub, 'addSurvey');
    await sut.add(dataSurvey)
    expect(spyAddSurvey).toHaveBeenCalledWith(dataSurvey);
  });


  it('Should throws if add AddSurveyRepository method throws', async () => {
    const {sut, addSurveyRepositoryStub} = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'addSurvey').mockImplementationOnce( async () => {
      throw new Error()
    });
     const response = sut.add(dataSurvey)
     expect(response).rejects.toThrow();
  });
});