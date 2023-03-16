import { MongoHelper } from "../mongo-helpers";
import { AddSurveyModel, AddSurveyRepository } from "../../../../data/usecases/db-add-survey-protocols";
import { LoadSurveysRepository, SurveyModel } from "../../../../data/usecases/db-load-surveys-protocols";

export class SurveyRepository implements AddSurveyRepository, LoadSurveysRepository {
  constructor(){}

  async addSurvey(dataSurvey: AddSurveyModel): Promise<void> {
    const collection =  MongoHelper.getCollection('surveys');
    await collection.insertOne(dataSurvey); 
  }

  async loadSurveys(): Promise<SurveyModel[]> {
    const res: SurveyModel[] = [];
    
    const collection = MongoHelper.getCollection('surveys');
    const surveysList= await collection.find().toArray();

    for (const survey of surveysList) res.push(MongoHelper.map(survey)); 
    return res;
  }
}