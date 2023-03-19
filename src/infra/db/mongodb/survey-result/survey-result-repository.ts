import { MongoHelper } from "../mongo-helpers";
import { SaveSurveyResultRepository } from "../../../../data/protocols/db/db-survey-result/save-survey-result-repository";
import { SurveyResultModel } from "../../../../domain/models/survey-result-model";
import { AddSurveyResultModel } from "../../../../domain/usecases/save-survey-result";

export class SurveyResultRepository implements SaveSurveyResultRepository {
  
  async saveResult(data: AddSurveyResultModel): Promise<SurveyResultModel> {
    const collection = MongoHelper.getCollection('survey-result');
    const { insertedId } = await collection.insertOne(data); 
    const result = await collection.findOne({_id: insertedId})
    return result && MongoHelper.map(result);  
  }
}