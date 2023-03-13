import { LoadAcccountByToken, AccountModel, Decrypter} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAcccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ){}

  async loadByToken(token: string, rule?: string): Promise<AccountModel> {
    this.decrypter.decipher(token)
    return null; 
  }
}