import { AccountModel } from "../../domain/account-model";
import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account";
import { Encrypter } from "../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter
  ) {}
  
  async add(values: AddAccountModel): Promise<AccountModel> {
    const { name, email, password } = values;
    const encryptedPassword = await this.encrypter.encrypt(password); 
    return null; 
  }
}