import { Router } from "express";
import { makeRouteAdapter } from "../apapters/express-adapter";
import { makeMiddlewareAdapter } from "../apapters/middleware-adapter";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";
import { makeAddSurveyController } from "../factories/survey/add-survey/add-survey-controller-factory";
import { makeLoadSurveysController } from "../factories/survey/load-surveys/load-surveys-controller-factory";
export default (router: Router): void => {
  const adminAuthMiddleware = makeMiddlewareAdapter(makeAuthMiddleware('admin'))
  const userAuthMiddleware = makeMiddlewareAdapter(makeAuthMiddleware())
  router.post('/surveys', adminAuthMiddleware, makeRouteAdapter(makeAddSurveyController()));
  router.get('/surveys', userAuthMiddleware, makeRouteAdapter(makeLoadSurveysController()));  
}