import { DbLoadSurveyById } from "../../../../data/usecases/db-load-survey-by-id/db-load-survey-by-id";
import { DbLoadSurveyResult } from "../../../../data/usecases/db-load-survey-result/db-load-survey-result";
import { LogMongoRepository } from "../../../../infra/db/mongodb/logs/log-mongo-repository";
import { SurveyResultRepository } from "../../../../infra/db/mongodb/survey-result/survey-result-repository";
import { SurveyRepository } from "../../../../infra/db/mongodb/survey/survey-repository";
import { LoadSurveyResultController } from "../../../../presentation/controller/survey/load-survey-result-controller/load-survey-result-controller";
import { Controller } from "../../../../presentation/protocols";
import { LogErrorDecorator } from "../../../decorator/log-error-decorator";

export const makeLoadSurveyResultController = (): Controller => {
  const surveyResultRepository = new SurveyResultRepository();
  const surveyRepsittory= new SurveyRepository();
 
  const dbLoadSurveyResult = new DbLoadSurveyResult(surveyResultRepository, surveyRepsittory);
  const dbLoadSurveyById = new DbLoadSurveyById(surveyRepsittory);
  
  const loadSurveyResultController = new LoadSurveyResultController(dbLoadSurveyById, dbLoadSurveyResult);
  const logRepository = new LogMongoRepository();
  return new LogErrorDecorator(loadSurveyResultController, logRepository);
};