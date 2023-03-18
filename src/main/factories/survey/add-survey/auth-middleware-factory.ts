import { DbLoadAccountByToken } from "../../../../data/usecases/db-load-account-by-token/db-load-account-by-token";
import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../../infra/db/mongodb/account/account-repository";
import { AuthMiddleware } from "../../../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../../../presentation/protocols";
import { ValidationRequireFields } from "../../../../validations/validation-require-fields.";
import { ValidationsComposite } from "../../../../validations/validations-composite";
import env from "../../../config/env";

export const makeAuthMiddleware = (role?: string): Middleware => {
  
  const jwtAdapter = new JwtAdapter(env.secretKey);
  const accountRepository = new AccountRepository();
  const dbLoadAccountByToken =  new DbLoadAccountByToken(jwtAdapter,accountRepository);

  const authValidations = new ValidationsComposite([ new ValidationRequireFields('x-access-token')]); 
  return new AuthMiddleware(authValidations, dbLoadAccountByToken);
};