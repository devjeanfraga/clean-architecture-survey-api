import { DbAuthentication } from "../../../data/usecases/db-authetication";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../infra/db/mongodb/account/account-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/logs/log-mongo-repository";
import { LoginController } from "../../../presentation/controller/login-controller/login-controller";
import { Controller } from "../../../presentation/protocols";
import { LogErrorDecorator } from "../../decorator/log-error-decorator";
import { makeLoginValidation } from "./login-validation-factory";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
  const secretKey = env.secretKey;
  const salt = env.salt; 
  const jwtAdapter = new JwtAdapter(secretKey);
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountRepository();
  const dbAuthentication = new DbAuthentication(accountRepository, bcryptAdapter, jwtAdapter, accountRepository);
  const logErrorRepository = new LogMongoRepository();
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication);
  return new LogErrorDecorator(loginController, logErrorRepository);
}; 