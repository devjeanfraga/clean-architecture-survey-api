import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";
import bcrypt from 'bcrypt';
import { Collection } from "mongodb";

describe('POST /login', () => {
  let collection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });

  beforeEach(async () => {
    collection = MongoHelper.getCollection('accounts');
    await collection.deleteMany({});
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('Should return status code 200 if success', async () => {
    const password = await bcrypt.hash('123', 12); 
    const fakeAccount = {
      name: 'any-name',
      email: 'any@mail.com',
      password
    };

    collection =  MongoHelper.getCollection('accounts');
    await collection.insertOne(fakeAccount);

    const response = await global.testRequest
      .post('/login')
      .send({
        email: 'any@mail.com',
        password: '123'
      });
    expect(response.statusCode).toBe(200)
  });

  it('Should return status code 401 if email not exists', async () => {
    const response = await global.testRequest
      .post('/login')
      .send({
        email: 'any@mail.com',
        password: '123'
      });
    expect(response.statusCode).toBe(401)
  });
})