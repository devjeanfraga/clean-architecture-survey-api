import { Collection } from "mongodb";
import { MongoHelper } from "../mongo-helpers";
import { LogMongoRepository } from "./log-mongo-repository";



describe("AccountRepository", () => {
  let logCollection: Collection;
  beforeAll( async () => {
  await MongoHelper.connect(global.__MONGO_URI__);   
  });

  beforeEach(async () => {
    logCollection =  MongoHelper.getCollection('logs');
    logCollection.deleteMany({});
  })

  afterAll(async () =>{
    await MongoHelper.disconnect();
  });

  it("Should create a log on logError success", async () => {
    const sut = new LogMongoRepository();
    await sut.logError("any-log-error");
    const log = await logCollection.countDocuments();
    expect(log).toBe(1);
  }); 
});