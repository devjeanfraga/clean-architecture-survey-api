import { AccountModel } from "../account-model"

export interface LoadAcccountByToken {
  loadByToken(accessToken: string, rule?: string): Promise<AccountModel> 
} 