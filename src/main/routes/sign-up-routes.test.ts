import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/mongo-helpers';  
import { Collection } from 'mongodb';

describe('POST SignUp Route', () => { 
  let collection: Collection; 
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });

  beforeEach( async () => {
    collection = MongoHelper.getCollection('accounts');
    await collection.deleteMany({})
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("should return an account", async () => {
    await request(app)
      .post('/signup')
      .send({
        name: 'any-name',
        email: 'any@mail.com',
        password: 'any-password',
        confirmPassword: 'any-passwrd'
      })
      .expect(200);
  });
 }); 

