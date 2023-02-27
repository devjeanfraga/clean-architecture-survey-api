import { AccountModel } from "../../domain/account-model";
import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account";

export class AddAccountRepository implements AddAccount {
  constructor () {}

  add(values: AddAccountModel): Promise<AccountModel> {
    return Promise.resolve(null);
  }
}
