import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import {Authentication, AuthenticationModel} from "../../domain/usecases/authentication" 

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string> {
    this.loadAccountByEmailRepository.loadByEmail(credentials.email);
    return null; 
  }
}