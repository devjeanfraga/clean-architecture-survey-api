import { MongoHelper } from "../mongo-helpers";
import { SurveyModel } from "../../../../domain/models/survey-model";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import { AddSurveyRepository } from "../../../../data/protocols/db/db-survey/add-survey-repository";
import { LoadSurveysRepository } from "../../../../data/protocols/db/db-survey/load-surveys-repository";
import { LoadSurveyByIdRepository } from "../../../../data/protocols/db/db-survey/load-survey-by-id-repository";

export class SurveyRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
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

  async loadById(id: string): Promise<SurveyModel> {
    const {makeObjectId} = MongoHelper;
    const collection = MongoHelper.getCollection('surveys');
    const survey = await collection.findOne({
      _id: makeObjectId(id)
    });
    return survey && MongoHelper.map(survey); 
  }
}