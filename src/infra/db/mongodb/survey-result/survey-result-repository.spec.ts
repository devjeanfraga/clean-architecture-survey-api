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

  it ('Should load survey result if LoadResult LoadSurveyResultBySurveyIdRepository on success', async () => {
    const account = await accountCollection.insertOne({
        name: 'any-name',
        email:'any@mail.com',
        password: 'any-password'
    });

    const account2 = await accountCollection.insertOne({
      name: 'any-name',
      email:'any@mail.com',
      password: 'any-password'
    });

    const account3 = await accountCollection.insertOne({
      name: 'any-name',
      email:'any@mail.com',
      password: 'any-password'
    });  

    const dataSurvey = {
      question: 'any-question',
      answers: [
        { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-03'}
      ],
      date: faker.date.recent()
    };
    const {insertedId} = await surveysCollection.insertOne(dataSurvey); 
    const surveyId = insertedId;
    await surveyResultCollection.insertMany([{
      surveyId: surveyId,
      accountId: account.insertedId,
      answer: 'any-answer-03',
      date: faker.date.recent() 
    },
    {
      surveyId: surveyId,
      accountId: account2.insertedId,
      answer: 'any-answer-02',
      date: faker.date.recent() 
    },
    {
      surveyId: surveyId,
      accountId: account3.insertedId,
      answer: 'any-answer-02',
      date: faker.date.recent() 
    },
    ]);

    const promise = await sut.loadResult(surveyId.toString(), account.insertedId.toString());
    expect(promise.surveyId).toBeTruthy();
  })
})