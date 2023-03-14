import { Router } from "express";
import { makeRouteAdapter } from "../apapters/express-adapter";
import { makeMiddlewareAdapter } from "../apapters/middleware-adapter";
import { makeAddSurveyController } from "../factories/survey/add-survey/add-survey-controller-factory";
import { makeAuthMiddleware } from "../factories/survey/add-survey/auth-middleware-factory";
export default (router: Router): void => {
  const authMiddleware = makeMiddlewareAdapter(makeAuthMiddleware())
  router.post('/add-survey', authMiddleware, makeRouteAdapter(makeAddSurveyController())); 
}