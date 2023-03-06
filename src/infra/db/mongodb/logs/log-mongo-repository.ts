import { LogErrorRepository } from "../../../../data/protocols/log-error-repository";
import { MongoHelper } from "../mongo-helpers";

export class LogMongoRepository implements LogErrorRepository {
  async logError(error: string): Promise<void> {
    const logCollection = MongoHelper.getCollection('logs');
    await logCollection.insertOne({
      error,
      date: new Date()
    });
  }
}