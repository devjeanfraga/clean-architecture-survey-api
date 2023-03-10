import { Router } from "express";
import { makeRouteAdapter } from "../apapters/express-adapter";
import { makeLoginController } from "../factories/login/login-controller-factory";

export default (router: Router): void => {
  router.post('/login', makeRouteAdapter(makeLoginController())); 
}