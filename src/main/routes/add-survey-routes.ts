import { Router } from "express";
import { makeRouteAdapter } from "../apapters/express-adapter";
import { makeAddSurveyController } from "../factories/survey/add-survey/add-survey-controller-factory";
export default (router: Router): void => {
  router.post('/add-survey', makeRouteAdapter(makeAddSurveyController())); 
}