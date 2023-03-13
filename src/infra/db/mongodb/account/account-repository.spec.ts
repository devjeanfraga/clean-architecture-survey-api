import { Collection, ObjectId } from "mongodb";
import { MongoHelper } from "../mongo-helpers";
import { AccountRepository } from "./account-repository";

const sut = new AccountRepository();

describe("AccountRepository", () => {
  let accountCollection: Collection;
  beforeAll( async () => {
  await MongoHelper.connect(global.__MONGO_URI__);   
  });

  beforeEach(async () => {
    accountCollection =  MongoHelper.getCollection('accounts');
    accountCollection.deleteMany({});
  })

  afterAll(async () =>{
    await MongoHelper.disconnect();
  });
  it("Should return an account by add on success", async () => {
    const accountData = {
      name: 'any-name',
      email:'any@mail.com',
      password: 'any-password'
    };
    const account = await sut.add(accountData);
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any-name');
    expect(account.email).toBe('any@mail.com');
    expect(account.password).toBe('any-password');
  }); 

  it("Should return an account by loadByEmail on success", async () => {
    const accountData = {
      name: 'any-name',
      email:'any@mail.com',
      password: 'any-password'
    };
    await sut.add(accountData);
    const account = await sut.loadByEmail('any@mail.com');
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any-name');
    expect(account.email).toBe('any@mail.com');
    expect(account.password).toBe('any-password');
  }); 

  it("Should update account to add accesssToken if updateAccessToken on success", async () => {
    let id: any; 
    const accountData = {
      name: 'any-name',
      email:'any@mail.com',
      password: 'any-password'
    };

    const { insertedId } = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({_id: insertedId});
    expect(account.accessToken).toBeFalsy();

    id = account._id.toHexString();
    await sut.updateAccessToken( id, 'any-access-token');

    id = new ObjectId(account._id.toHexString());
    const { accessToken } = await accountCollection.findOne({_id: id});
    expect(accessToken).toBeTruthy();
    expect(accessToken).toBe('any-access-token'); 
  });

  it('Should return an account if loadByToken on success with role', async () => {
    const token = 'any-token', role = 'admin';
    const accountData = {
      name: 'any-name',
      email:'any@mail.com',
      password: 'any-password',
      role
    };

    const { insertedId } = await accountCollection.insertOne(accountData);
    const { _id } = await accountCollection.findOne({_id: insertedId});
    const id = _id.toHexString();
    await sut.updateAccessToken( id, token);

    const account = await sut.loadByToken( token, role );
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
  }); 
});