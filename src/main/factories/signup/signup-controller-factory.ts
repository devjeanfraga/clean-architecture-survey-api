import { DbAddAccount } from "../../../data/usecases/db-add-acount";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter";
import { AccountRepository } from "../../../infra/db/mongodb/account/account-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/logs/log-mongo-repository";
import { SignUpController } from "../../../presentation/controller/signup-controller/signup-controller";
import { Controller } from "../../../presentation/protocols/protocol-controller";
import { LogErrorDecorator } from "../../decorator/log-error-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {  
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountRepository();

  const dbAddAccount = new DbAddAccount(bcryptAdapter,accountRepository);
  const signupController = new SignUpController( makeSignUpValidation(), dbAddAccount);

  const logMongoRespository = new LogMongoRepository();
  return  new LogErrorDecorator(signupController, logMongoRespository); 
};