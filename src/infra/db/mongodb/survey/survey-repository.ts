import { MongoHelper } from "../mongo-helpers";
import { AddSurveyModel, AddSurveyRepository } from "../../../../data/usecases/db-add-survey-protocols";

export class SurveyRepository implements AddSurveyRepository {
  constructor(){}

  async addSurvey(dataSurvey: AddSurveyModel): Promise<void> {
    const collection =  MongoHelper.getCollection('surveys');
    await collection.insertOne(dataSurvey); 
  }
}