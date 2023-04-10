import { faker } from "@faker-js/faker";
import { LoadSurveyByIdRepository, LoadSurveyResultBySurveyIdRepository, SurveyResultModel } from "./db-load-survey-result-protocols";
import { DbLoadSurveyResult } from './db-load-survey-result';
import { SurveyModel } from "../db-load-surveys/db-load-surveys-protocols";
import { rejects } from "assert";

const fakeSurveyResult = {
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
}

const fakeSurvey = {
  id: 'any-id',
  question: 'any-question',
  answers: [{answer: 'any-answer-1', image: 'any-image'}, {answer: 'any-answer-1'}],
  date: faker.date.recent() 
}

const makeloadSurveyResultBySurveyIdRepository = (): LoadSurveyResultBySurveyIdRepository => {
  class LoadSurveyResultBySurveyIdRepositoryStub implements LoadSurveyResultBySurveyIdRepository {
    async loadResult(surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return Promise.resolve(fakeSurveyResult)
    }
  }
  return new LoadSurveyResultBySurveyIdRepositoryStub();
};

const makeloadSurveyRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(fakeSurvey); 
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

interface SutTypes {
  sut: DbLoadSurveyResult;
  loadSurveyResultBySurveyIdRepositoryStub: LoadSurveyResultBySurveyIdRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyResultBySurveyIdRepositoryStub = makeloadSurveyResultBySurveyIdRepository();
  const loadSurveyByIdRepositoryStub = makeloadSurveyRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultBySurveyIdRepositoryStub, loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyResultBySurveyIdRepositoryStub,
    loadSurveyByIdRepositoryStub
  } 
};

describe('DbLoadSurveyResult Usecase', () => {

  it ('Should call loadResult LoadSurveyResultBySurveyIdRepository method with correct values', async ()  => {
    const {sut, loadSurveyResultBySurveyIdRepositoryStub } = makeSut();
    const spyLoadResult = jest.spyOn(loadSurveyResultBySurveyIdRepositoryStub, 'loadResult');
    await sut.load('any-survey-id', 'any-account-id');
    expect(spyLoadResult).toHaveBeenCalledWith('any-survey-id', 'any-account-id');
  });

  it ('Should call loadById LoadSurveyByIdRepository method with correct values if LoadSurveyResultBySurveyIdRepository returns null', async ()  => {
    const {sut, loadSurveyResultBySurveyIdRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultBySurveyIdRepositoryStub, 'loadResult').mockReturnValueOnce(null);
    const spyloadById = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.load('any-survey-id', 'any-account-id');
    expect(spyloadById).toHaveBeenCalledWith('any-survey-id');
  });

  it ('Should throws if loadResult LoadSurveyResultBySurveyIdRepository method throws', async ()  => {
    const {sut, loadSurveyResultBySurveyIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultBySurveyIdRepositoryStub, 'loadResult').mockImplementationOnce(()=> {
      throw new Error();
    });
    const promise = sut.load('any-survey-id', 'any-account-id');
    await expect(promise).rejects.toThrow();
  });

  it ('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async ()  => {
    const {sut, loadSurveyResultBySurveyIdRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultBySurveyIdRepositoryStub, 'loadResult').mockReturnValueOnce(null);
    const promise = await sut.load('any-survey-id', 'any-account-id');
    expect(promise).toEqual({
      surveyId: fakeSurvey.id,
      question: fakeSurvey.question, 
      date:fakeSurvey.date,
      answers: fakeSurvey.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false 
      }))
    })

  });
});