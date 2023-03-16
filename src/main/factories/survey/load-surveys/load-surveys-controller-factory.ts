import { DbLoadSurveys } from "../../../../data/usecases/db-load-surveys";
import { LogMongoRepository } from "../../../../infra/db/mongodb/logs/log-mongo-repository";
import { SurveyRepository } from "../../../../infra/db/mongodb/survey/survey-repository";
import { LoadSurveysController } from "../../../../presentation/controller/survey/load-surveys-controller/load-survey-controller";
import { Controller } from "../../../../presentation/protocols";
import { LogErrorDecorator } from "../../../decorator/log-error-decorator";

export const makeLoadSurveysController = (): Controller => {
  const logRepository = new LogMongoRepository();

  const surveyRepository = new SurveyRepository();
  const dbLoadSurveys = new DbLoadSurveys(surveyRepository);
  const loadSurveysController = new LoadSurveysController(dbLoadSurveys);

  return new LogErrorDecorator(loadSurveysController, logRepository);
};