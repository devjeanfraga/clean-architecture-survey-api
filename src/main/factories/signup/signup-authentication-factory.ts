import { DbAuthentication } from "../../../data/usecases/db-authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter";
import { AccountRepository } from "../../../infra/db/mongodb/account/account-repository";
import env from "../../config/env";

export const makeSignUpAuthentication = (): DbAuthentication => {
  const secretKey = env.secretKey;
  const salt = env.salt; 
  const jwtAdapter = new JwtAdapter(secretKey);
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountRepository();
  return  new DbAuthentication(accountRepository, bcryptAdapter, jwtAdapter, accountRepository);
}; 