import { AccountModel } from "../../../domain/account-model";
import { AddAccount, AddAccountModel } from "../../../domain/usecases/add-account";
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  
  async add(values: AddAccountModel): Promise<AccountModel> {
    const emailExist = await this.loadAccountByEmailRepository.loadByEmail(values.email);
    if (!emailExist) {
      const encryptedPassword = await this.hasher.hash(values.password);
      values = {...values, password: encryptedPassword } 
      const account = await this.addAccountRepository.add(values);
      return account; 
    }
    return null; 
  }
}