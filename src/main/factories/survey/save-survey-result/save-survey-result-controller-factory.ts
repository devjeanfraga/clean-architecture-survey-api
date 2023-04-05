import { DbLoadSurveyById } from "../../../../data/usecases/db-load-survey-by-id/db-load-survey-by-id";
import { DbSaveSurveyResult } from "../../../../data/usecases/db-save-survey-result/db-save-survey-result";
import { LogMongoRepository } from "../../../../infra/db/mongodb/logs/log-mongo-repository";
import { SurveyResultRepository } from "../../../../infra/db/mongodb/survey-result/survey-result-repository";
import { SurveyRepository } from "../../../../infra/db/mongodb/survey/survey-repository";
import { SaveSurveyResultController } from "../../../../presentation/controller/survey/save-survey-result-controller/save-survey-result-controller";
import { Controller } from "../../../../presentation/protocols";
import { LogErrorDecorator } from "../../../decorator/log-error-decorator";

export const makeSaveSurveyResultController = () : Controller => {
  
  const surveyRepsittory = new SurveyRepository();
  const surveyResultRepositry = new SurveyResultRepository();
  
  const dbLoadSurveyById = new DbLoadSurveyById(surveyRepsittory);
  const dbSaveSurveyResult = new DbSaveSurveyResult(surveyResultRepositry, surveyResultRepositry);
  
  const saveSurveyResultController = new SaveSurveyResultController(dbLoadSurveyById, dbSaveSurveyResult);
  const logRepository = new LogMongoRepository();
  
  return new LogErrorDecorator(saveSurveyResultController, logRepository);
};