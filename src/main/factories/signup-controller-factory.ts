import { DbAddAccount } from "../../data/usecases/db-add-acount";
import { BcryptAdapter } from "../../infra/bcrypt-adapter";
import { AccountRepository } from "../../infra/db/mongodb/account/account-repository";
import { LogMongoRepository } from "../../infra/db/mongodb/logs/log-mongo-repository";
import { SignUpController } from "../../presentation/controller/signup";
import { Controller } from "../../presentation/protocols/protocol-controller";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogErrorDecorator } from "../decorator/log-error-decorator";

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountRepository();

  const dbAddAccount = new DbAddAccount(bcryptAdapter,accountRepository);
  const signupController = new SignUpController(emailValidatorAdapter,dbAddAccount);
  
  const logMongoRespository = new LogMongoRepository();
  return  new LogErrorDecorator(signupController, logMongoRespository); 
};