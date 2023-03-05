import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";


describe('POST /signup', () => { 
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });
  
  afterAll(async () => {
    await MongoHelper.disconnect(); 
  });
  it("should return an account", async () => {
    const response = await global.testRequest
      .post('/signup')
      .send({
        name: 'any-name',
        email: 'any@mail.com',
        password: 'any-password',
        confirmPassword: 'any-password'
      })
      expect(response.statusCode).toEqual(200);
  });
 }); 