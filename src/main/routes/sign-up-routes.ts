import { Router } from 'express';
import { makeRouteAdapter } from '../apapters/express-adapter';
import { makeSignUpController } from '../factories/signup-controller-factory';

export default (router: Router): void => {
  router.post('/signup', makeRouteAdapter(makeSignUpController()));
};