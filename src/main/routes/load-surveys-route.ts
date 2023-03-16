import { Router } from "express";
import { makeRouteAdapter } from "../apapters/express-adapter";
import { makeLoadSurveysController } from "../factories/survey/load-surveys/load-surveys-controller-factory";

export default (router: Router): void => {
  router.get('/load-surveys', makeRouteAdapter(makeLoadSurveysController())); 
}; 