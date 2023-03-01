import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/account-model";
import { MongoHelper } from "../mongo-helpers";

export class AccountRepository implements AddAccountRepository {
  async add(values: AddAccountModel): Promise<AccountModel> {
    const collection =  MongoHelper.getCollection('account');
    const response = await collection.insertOne(values); 
    const account = await collection.findOne({_id: response.insertedId})
    return account && MongoHelper.map(account); 
  }
} 