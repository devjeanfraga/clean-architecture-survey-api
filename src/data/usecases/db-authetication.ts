import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import {Authentication, AuthenticationModel} from "../../domain/usecases/authentication" 
import { HasherCompare } from "../protocols/hasher-compare";
import { Encrypter } from "../protocols/encrypter";
import { UpdateAccessTokenRepository } from "../protocols/update-access-token-repository";

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasherCompare: HasherCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email);
    const isValidPassword = account && await this.hasherCompare.compare(credentials.password, account.password); 
    if (isValidPassword) {
      const accessToken = await this.encrypter.encrypt(account.id);
      await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
      return accessToken;
    }
    return null
  }
}