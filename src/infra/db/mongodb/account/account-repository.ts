import { AddAccountRepository } from "../../../../data/protocols/db/db-account/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/account-model";
import { MongoHelper } from "../mongo-helpers";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/db-account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/db-account/update-access-token-repository";
import { LoadAccountByTokenRepository } from "../../../../data/usecases/db-load-account-by-token-protocols";

export class AccountRepository implements 
  AddAccountRepository, 
  LoadAccountByEmailRepository, 
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository
  {

  async add(values: AddAccountModel): Promise<AccountModel> {
    const collection =  MongoHelper.getCollection('accounts');
    const response = await collection.insertOne(values); 
    const account = await collection.findOne({_id: response.insertedId})
    return account && MongoHelper.map(account); 
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const collection =  MongoHelper.getCollection('accounts');
    const account = await collection.findOne({email: email});
    return account && MongoHelper.map(account); 
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const { makeObjectId } = MongoHelper;
    const collection = MongoHelper.getCollection('accounts');
    await collection.updateOne(
      {_id: makeObjectId(id) },  
      { $set: { accessToken: accessToken } }
    );
  }
  
  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('accounts');
    const account = await collection.findOne(
      {
        accessToken: token,
        $or: [
          { role: 'admin' }, 
          { role: role }
        ]
      }
    );
    return account &&  MongoHelper.map(account); 
  }
} 