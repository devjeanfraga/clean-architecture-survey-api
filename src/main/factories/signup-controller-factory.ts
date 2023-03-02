import { DbAddAccount } from "../../data/usecases/db-add-acount";
import { BcryptAdapter } from "../../infra/bcrypt-adapter";
import { AccountRepository } from "../../infra/db/mongodb/account/account-repository";
import { SignUpController } from "../../presentation/controller/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountRepository();

  const dbAddAccount = new DbAddAccount(bcryptAdapter,accountRepository);
  return  new SignUpController(emailValidatorAdapter,dbAddAccount);
};