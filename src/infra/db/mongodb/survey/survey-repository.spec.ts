import { faker } from "@faker-js/faker";
import { Collection } from "mongodb";
import { MongoHelper } from "../mongo-helpers";
import { SurveyRepository } from "./survey-repository";

const dataSurvey = {
  question: 'any-question',
  answers: [
    { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
    { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
    { answer: 'any-answer-03'}
  ],
  date: faker.date.recent()
};

const dataSurveyList = [
  {
    question: 'any-question-1',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
    date: faker.date.recent()
  },

  {
    question: 'any-question-2',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
    date: faker.date.recent()
  },

  {
    question: 'any-question-3',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
    date: faker.date.recent()
  }
];

const sut = new SurveyRepository();
describe('SurveyRepository', () => {
  let surveyCollection: Collection;
  beforeAll( async () => {
  await MongoHelper.connect(global.__MONGO_URI__);   
  });

  beforeEach(async () => {
    surveyCollection =  MongoHelper.getCollection('surveys');
    surveyCollection.deleteMany({});
  })

  afterAll(async () =>{
    await MongoHelper.disconnect();
  });

  it('Should add a survey on success', async () => {
    await sut.addSurvey(dataSurvey);
    const promise = await surveyCollection.countDocuments(); 
    expect(promise).toBe(1); 
  });

  it('Should return a list of surveys id loadSurveys on success', async () => {
    await surveyCollection.insertMany(dataSurveyList);

    const promise = await sut.loadSurveys();
    const res = promise.length; 
    expect(res).toBe(3); 
  });

  it('Should return a survey if loadById on success', async () => {
    const { insertedId } = await surveyCollection.insertOne(dataSurvey);
    const res = await sut.loadById(insertedId.toHexString()); 
    expect(res.id).toBeTruthy();
  });
})