import { DbAddAccount } from "../../../data/usecases/db-add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter";
import { AccountRepository } from "../../../infra/db/mongodb/account/account-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/logs/log-mongo-repository";
import { SignUpController } from "../../../presentation/controller/log-on/signup-controller/signup-controller";
import { Controller } from "../../../presentation/protocols/protocol-controller";
import { LogErrorDecorator } from "../../decorator/log-error-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";
import env from "../../config/env";
import { makeSignUpAuthentication } from "./signup-authentication-factory";

export const makeSignUpController = (): Controller => {  
  const salt = env.salt;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountRepository();

  const dbAddAccount = new DbAddAccount(accountRepository, bcryptAdapter,accountRepository);
  const signupController = new SignUpController( makeSignUpValidation(), dbAddAccount, makeSignUpAuthentication());

  const logMongoRespository = new LogMongoRepository();
  return  new LogErrorDecorator(signupController, logMongoRespository); 
};