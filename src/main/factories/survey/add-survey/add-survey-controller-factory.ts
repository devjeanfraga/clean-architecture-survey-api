import { AddSurveyController } from "../../../../presentation/controller/survey/add-survey-controller/add-survey-controller";
import { Controller } from "../../../../presentation/protocols";
import { LogErrorDecorator } from "../../../decorator/log-error-decorator";
import { LogMongoRepository } from "../../../../infra/db/mongodb/logs/log-mongo-repository";
import { makeAddSurveyValidation } from "./add-survey-validation-factory";
import { SurveyRepository } from "../../../../infra/db/mongodb/survey/survey-repository";
import { DbAddSurvey } from "../../../../data/usecases/db-add-survey/db-add-survey";

export const makeAddSurveyController = (): Controller => {
  const surveyRepository = new SurveyRepository();
  const dbAddSurvey = new DbAddSurvey(surveyRepository);
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(),dbAddSurvey);
  const logMongoRepository = new LogMongoRepository();
  return new LogErrorDecorator(addSurveyController, logMongoRepository);
}; 