import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import {Authentication, AuthenticationModel} from "../../domain/usecases/authentication" 
import { HasherCompare } from "../protocols/hasher-compare";

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasherCompare: HasherCompare
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email);
    const isValidPassword = account && await this.hasherCompare.compare(credentials.password, account.password); 
    if (!isValidPassword) {
      return null 
    }
    return null   
  }
}