import { AccountModel } from "../account-model"

export interface LoadAcccountByToken {
  loadByToken(token: string, rule?: string): Promise<AccountModel> 
} 