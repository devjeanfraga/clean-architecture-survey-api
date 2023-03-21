import { faker } from "@faker-js/faker";
import { Collection } from "mongodb";
import { AddSurveyResultModel } from "../../../../domain/usecases/save-survey-result";
import { MongoHelper } from "../mongo-helpers";
import { SurveyResultRepository } from "./survey-result-repository";

const fakeDataSurvey: AddSurveyResultModel = {
  surveyId: 'any-surveyId',
  accountId: 'any-accountId',
  answer: 'any-answer',
  date: faker.date.recent() 
}

const sut = new SurveyResultRepository();
describe('SurveyResultRepository', () => {
  let surveyCollection: Collection;
  beforeAll( async () => {
  await MongoHelper.connect(global.__MONGO_URI__);   
  });

  beforeEach(async () => {
    surveyCollection =  MongoHelper.getCollection('survey-result');
    surveyCollection.deleteMany({});
  })

  afterAll(async () =>{
    await MongoHelper.disconnect();
  });

  it('Should save survey result and return a survey result on saveResult success', async () => {
    const promise = await sut.saveResult(fakeDataSurvey);
    expect(promise.id).toBeTruthy();
    expect(promise.surveyId).toBeTruthy();
    expect(promise.accountId).toBeTruthy();
    expect(promise.answer).toBeTruthy();
  });
})