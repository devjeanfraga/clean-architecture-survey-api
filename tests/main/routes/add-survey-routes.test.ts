import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";
import { Collection } from "mongodb";

describe('POST /add-survey', () => {
  let surveyCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('Should return status code 204 if success', async () => {
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
    expect(response.statusCode).toBe(204)
  });
})