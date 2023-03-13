import { AccountModel } from "../account-model"

export interface LoadAcccountByToken {
  loadByToken(accessToken: string, role?: string): Promise<AccountModel> 
}