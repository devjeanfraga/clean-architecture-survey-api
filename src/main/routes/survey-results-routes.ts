import { Router } from "express";
import { makeRouteAdapter } from "../apapters/express-adapter";
import { makeMiddlewareAdapter } from "../apapters/middleware-adapter";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";
import { makeSaveSurveyResultController } from "../factories/survey/save-survey-result/save-survey-result-controller-factory";

export default ( router: Router ): void => {
  const userAuthMiddleware = makeMiddlewareAdapter(makeAuthMiddleware());
  router.put('/surveys/:surveyId/results', userAuthMiddleware, makeRouteAdapter(makeSaveSurveyResultController())); 
}