import { AccountModel } from "../../domain/account-model";
import { DbAuthentication } from "./db-authetication";
import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";

const credentials ={
    email: 'any@mail.com',
    password: 'any-password'
};

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail(email: string): Promise<AccountModel> {
        return null;
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

 interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
 } 
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
} 
describe('DbAuthentication Usecase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const spyLoadByEmail = jest .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(credentials);
    expect(spyLoadByEmail).toHaveBeenCalledWith(credentials.email);
  });

  
});