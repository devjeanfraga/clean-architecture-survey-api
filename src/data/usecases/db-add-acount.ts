import { AccountModel } from "../../domain/account-model";
import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account";
import { AddAccountRepository } from "../protocols/add-account-repository";
import { Hasher } from "../protocols/hasher";

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  
  async add(values: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.hasher.hash(values.password);
    values = {...values, password: encryptedPassword } 
    const account = await this.addAccountRepository.add(values);
    return account; 
  }
}