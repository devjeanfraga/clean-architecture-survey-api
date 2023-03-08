import { AccountModel } from "../../domain/account-model";
import { DbAuthentication } from "./db-authetication";
import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import { HasherCompare
 } from "../protocols/hasher-compare";
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

  const makeHasherCompare = (): HasherCompare => {
    class HasherCompareStub implements HasherCompare {
      compare(value:string, encrypted: string): Promise<boolean> {
        return null;
      }
    }
    return new HasherCompareStub();
  };

 interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hasherCompareStub: HasherCompare;
 } 
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hasherCompareStub = makeHasherCompare();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hasherCompareStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hasherCompareStub
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

  it('Should throw if loadByEmail LoadAccountByEmailRepository method throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(async ()=> {
      throw new Error();
    });
    const promise = sut.auth(credentials);
    await expect(promise).rejects.toThrow(); 
  });

  it('Should call HasherCompare with correct values if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, hasherCompareStub } = makeSut();
    const spyCompare = jest .spyOn(hasherCompareStub, 'compare');
    await sut.auth(credentials);
    expect(spyCompare).toHaveBeenCalledWith( credentials.password, fakeAccount.password );
  });
});