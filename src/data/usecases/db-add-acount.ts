import { AccountModel } from "../../domain/account-model";
import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account";
import { AddAccountRepository } from "../protocols/add-account-repository";
import { Encrypter } from "../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  
  async add(values: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(values.password);
    values = {...values, password: encryptedPassword } 
    const account = await this.addAccountRepository.add(values);
    return account; 
  }
}