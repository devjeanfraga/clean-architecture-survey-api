import { AccountModel } from "../../domain/account-model";
import { DbAuthentication } from "./db-authetication";
import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";

const credentials ={
    email: 'any@mail.com',
    password: 'any-password'
};

const  fakeAccount = {
  id: 'any-id',
  name: 'any-name',
  email: 'any@mail.com',
  password:'any-hashed-password'
}

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail(email: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(fakeAccount));
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
  it('Should call loadByEmail LoadAccountByEmailRepository method with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const spyLoadByEmail = jest .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(credentials);
    expect(spyLoadByEmail).toHaveBeenCalledWith(credentials.email);
  });

  it('Should return null if loadByEmail LoadAccountByEmailRepository method returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(async ()=> {
      return new Promise(resolve => resolve(null))
    });
    const promise = await sut.auth(credentials);
    expect(promise).toBeNull;
  });

});