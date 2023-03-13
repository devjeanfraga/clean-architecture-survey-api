import { LoadAcccountByToken, AccountModel, Decrypter} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAcccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ){}

  async loadByToken(accessToken: string, rule?: string): Promise<AccountModel> {
    const token:string = await this.decrypter.decipher(accessToken);
    if(!token) return null; 
    return null; 
  }
}