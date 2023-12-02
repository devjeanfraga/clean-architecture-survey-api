import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";
import { faker } from "@faker-js/faker";

describe('POST /signup', () => { 
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });
  
  afterAll(async () => {
    await MongoHelper.disconnect(); 
  });

  it("should return an account", async () => {
    const response = await global.testRequest
      .post('/survey-api/signup')
      .send({
        name: 'any-name',
        email: faker.internet.email(),
        password: 'any-password',
        confirmPassword: 'any-password'
      })
      expect(response.statusCode).toEqual(200);
  });
 }); 