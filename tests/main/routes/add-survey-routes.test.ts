import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";
import { Collection } from "mongodb";
import jwt from 'jsonwebtoken';
import env from "../../../src/main/config/env";

let surveysCollection: Collection;
let accountsCollection: Collection;

const mockAccessToken = async (): Promise<string> => {
  const result = await accountsCollection.insertOne({
    name: 'Jean',
    email: 'jean@mail.com',
    password: '123',
    role: 'admin' 
  });

  const id = result.insertedId.toHexString();
  const accessToken = jwt.sign({ id }, env.secretKey);
  await accountsCollection.updateOne(
    { _id: result.insertedId},
    { $set: { accessToken: accessToken } }
  );

  return accessToken;
};

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
      .post('/clean-api/add-survey')
      .send(fakeSurvey);
    expect(response.statusCode).toBe(403)
  });

  it('Should return status code 204 if on success', async () => {
    const accessToken = await mockAccessToken();
    const fakeSurvey = {
      question: 'any-question',
      answers:  [
        { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
        { answer: 'any-answer-03'}
      ],
    };

    const response = await global.testRequest
      .post('/clean-api/add-survey')
      .set('x-access-token', accessToken)
      .send(fakeSurvey);
    expect(response.statusCode).toBe(204)
  });
})