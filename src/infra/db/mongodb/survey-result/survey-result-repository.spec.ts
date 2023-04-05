import { faker } from "@faker-js/faker";
import { Collection } from "mongodb";
import { AddSurveyResultModel } from "../../../../domain/usecases/save-survey-result";
import { MongoHelper } from "../mongo-helpers";
import { SurveyResultRepository } from "./survey-result-repository";

const fakeDataSurvey: AddSurveyResultModel = {
  surveyId: 'any-surveyId',
  accountId: 'any-accountId',
  answer: 'any-answer-03',
  date: faker.date.recent() 
}

const sut = new SurveyResultRepository();

describe('SurveyResultRepository', () => {

  let surveyResultCollection: Collection;
  let surveysCollection: Collection;
  let accountCollection: Collection;

  beforeAll( async () => {
  await MongoHelper.connect(global.__MONGO_URI__);   
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});

    surveyResultCollection = MongoHelper.getCollection('survey-result');
    await surveyResultCollection.deleteMany({});

    surveysCollection = MongoHelper.getCollection('surveys');
    await surveysCollection.deleteMany({});
  })

  afterAll(async () =>{
    await MongoHelper.disconnect();
  });

  it('Should save answer result on saveResult success', async () => {
    await sut.saveResult(fakeDataSurvey);
    const promise = await surveyResultCollection.countDocuments();
    expect(promise).toBe(1);
  });
})