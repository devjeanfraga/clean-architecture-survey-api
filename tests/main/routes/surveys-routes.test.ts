import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";
import { Collection } from "mongodb";
import jwt from 'jsonwebtoken';
import env from "../../../src/main/config/env";

let surveysCollection: Collection;
let accountsCollection: Collection;

const mockAccessToken = async (email:string, role?: string): Promise<string> => {
  const result = await accountsCollection.insertOne({
    name: 'Jean',
    email,
    password: '123',
    role
  });

  const id = result.insertedId.toHexString();
  const accessToken = jwt.sign({ id }, env.secretKey);
  await accountsCollection.updateOne(
    { _id: result.insertedId},
    { $set: { accessToken: accessToken } }
  );

  return accessToken;
};

describe('POST-GET /surveys', () => {

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

  it('Should return status code 403 if not exists x-access-token', async () => {

    const fakeSurvey = {
      question: 'any-question',
      answers:  [
        { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-03'}
      ],
    };

    const response = await global.testRequest
      .post('/clean-api/surveys')
      .send(fakeSurvey);
    expect(response.statusCode).toBe(403)
  });

  it('Should return status code 204 if on success', async () => {
    const accessToken = await mockAccessToken('any@mail.com', 'admin');
    const fakeSurvey = {
      question: 'any-question',
      answers:  [
        { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-03'}
      ],
    };

    const response = await global.testRequest
      .post('/clean-api/surveys')
      .set('x-access-token', accessToken)
      .send(fakeSurvey);
    expect(response.statusCode).toBe(204)
  });

  it('Should return status code 200 if on success', async () => {
    const accessToken = await mockAccessToken('any.another@mail.com'); 
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
      .get('/clean-api/surveys')
      .set('x-access-token', accessToken)
      expect(response.statusCode).toBe(200)
  });
})