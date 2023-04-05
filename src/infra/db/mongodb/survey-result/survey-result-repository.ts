import { MongoHelper } from "../mongo-helpers";
import { SaveSurveyResultRepository } from "../../../../data/protocols/db/db-survey-result/save-survey-result-repository";
import { LoadSurveyResultBySurveyIdRepository } from "../../../../data/protocols/db/db-survey-result/load-survey-result-by-survey-id-repository";
import { SurveyResultModel } from "../../../../domain/models/survey-result-model";
import { AddSurveyResultModel } from "../../../../domain/usecases/save-survey-result";
import { QueryBuilder } from "../query-builder";

export class SurveyResultRepository implements SaveSurveyResultRepository {
  
  async saveResult(data: AddSurveyResultModel): Promise<void> {
    const { accountId, surveyId, answer, date } = data;
    const collection = MongoHelper.getCollection('survey-result');

    await collection.findOneAndUpdate({ 
        surveyId: surveyId,
        accountId: accountId
      }, {
        $set: {
          answer: answer, 
          date: date
        }
      },
      { upsert: true }
    ); 
  }


}