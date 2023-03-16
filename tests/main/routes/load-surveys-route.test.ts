import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";
import { Collection } from "mongodb";

let surveysCollection: Collection;
let accountsCollection: Collection;

describe('POST /add-survey', () => {

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });

  beforeEach(async () => {
    surveysCollection = MongoHelper.getCollection('surveys');
    accountsCollection = MongoHelper.getCollection('accounts');
    await surveysCollection.deleteMany({});
    await accountsCollection.deleteMany({});
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('Should return status code 200 if on success', async () => {
    const fakeSurveys = [
      {
        question: 'any-question',
        answers:  [
          { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
          { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
          { answer: 'any-answer-03'}
        ],
      }, 
      {
        question: 'any-question',
        answers:  [
          { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
          { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
          { answer: 'any-answer-03'}
        ],
      },
      {
        question: 'any-question',
        answers:  [
          { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
          { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
          { answer: 'any-answer-03'}
        ],
      }
    ];
    await surveysCollection.insertMany(fakeSurveys); 
    const response = await global.testRequest
      .get('/clean-api/load-surveys')
      expect(response.statusCode).toBe(200)
  });
})