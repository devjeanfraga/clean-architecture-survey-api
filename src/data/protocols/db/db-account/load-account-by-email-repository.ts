import { AccountModel } from "../../../../domain/account-model";

export interface LoadAccountByEmailRepository {
  loadByEmail(email:string): Promise<AccountModel>
}