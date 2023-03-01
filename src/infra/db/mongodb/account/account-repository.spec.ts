import { Collection } from "mongodb";
import { MongoHelper } from "../mongo-helpers";
import { AccountRepository } from "./account-repository";



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
  it("Should return an account on add success", async () => {
    const sut = new AccountRepository();
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
});