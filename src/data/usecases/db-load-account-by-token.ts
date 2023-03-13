import { LoadAcccountByToken, AccountModel, Decrypter, LoadAccountByTokenRepository} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAcccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ){}

  async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
    const token:string = await this.decrypter.decipher(accessToken);
    const account = token && await this.loadAccountByTokenRepository.loadByToken(token, role);

    if (!account) return null; 
    return account; 
  }
}