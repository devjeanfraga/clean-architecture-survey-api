import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/account-model";
import { MongoHelper } from "../mongo-helpers";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/load-account-by-email-repository";

export class AccountRepository implements AddAccountRepository, LoadAccountByEmailRepository {

  async add(values: AddAccountModel): Promise<AccountModel> {
    const collection =  MongoHelper.getCollection('account');
    const response = await collection.insertOne(values); 
    const account = await collection.findOne({_id: response.insertedId})
    return account && MongoHelper.map(account); 
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const collection =  MongoHelper.getCollection('account');
    const account = await collection.findOne({email: email});
    return account && MongoHelper.map(account); 
  }
} 