import { LogErrorRepository } from "../../../../data/protocols/log-error-repository";
import { MongoHelper } from "../mongo-helpers";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const logCollection = MongoHelper.getCollection('logs');
    await logCollection.insertOne({
      stack,
      date: new Date()
    });
  }
}