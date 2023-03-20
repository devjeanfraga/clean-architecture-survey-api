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

describe('PUT /surveys/:surveyId/results', () => {

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
    const accessToken = await mockAccessToken('any@mail.com'); 
    const fakeSurveys = [
      {
        question: 'valid-question-1',
        answers:  [
          { answer: '01-valid-answer-01', image: 'http://localhost:8080/any-image'},
          { answer: '01-valid-answer-02', image: 'http://localhost:8080/any-image'},
          { answer: '01-valid-answer-03'}
        ],
        date: new Date()
      }, 
      {
        question: 'valid-question-2',
        answers:  [
          { answer: '02-valid-answer-01', image: 'http://localhost:8080/any-image'},
          { answer: '02-valid-answer-02', image: 'http://localhost:8080/any-image'},
          { answer: '02-valid-answer-03'}
        ],
        date: new Date()

      }
    ];
    await surveysCollection.insertMany(fakeSurveys);
    const { _id } = await surveysCollection.findOne({question: 'valid-question-2'}) 
    const response = await global.testRequest
      .put(`/clean-api/surveys/${_id.toString()}/results`)
      .set('x-access-token', accessToken)
      .send({answer: '02-valid-answer-03'});
      expect(response.statusCode).toBe(200)
  });
})