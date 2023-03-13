import { AccountModel } from "../../../usecases/db-load-account-by-token-protocols"

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: string): Promise<AccountModel>
}