import { AccountModel } from "../../domain/account-model";
import { DbAuthentication } from "./db-authetication";
import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import { HasherCompare } from "../protocols/hasher-compare";
import { Encrypter } from "../protocols/encrypter";

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
        return new Promise(resolve => resolve(true));
      }
    }
    return new HasherCompareStub();
  };


  const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> { 
        return new Promise(resolve => resolve('access-token'))
      }
    }
    return new EncrypterStub();
  };

 interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hasherCompareStub: HasherCompare;
  encrypterStub: Encrypter;
 } 
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hasherCompareStub = makeHasherCompare();
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hasherCompareStub, encrypterStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hasherCompareStub,
    encrypterStub
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

  it('Should return null if compare HasherCompare method returns null', async () => {
    const { sut, hasherCompareStub } = makeSut();
    jest .spyOn(hasherCompareStub, 'compare').mockImplementationOnce(async ()=> {
      return new Promise(resolve => resolve(null));
    });
    const promise = await sut.auth(credentials);
    expect(promise).toBeNull();
  });

  it('Should throws if compare HasherCompare method throws', async () => {
    const { sut, hasherCompareStub } = makeSut();
    jest .spyOn(hasherCompareStub, 'compare').mockImplementationOnce(async ()=> {
      throw new Error();
    });
    const promise =  sut.auth(credentials);
    await expect(promise).rejects.toThrow();
  });

  it('Should call encrypt Encrypter method with correct values if compare HasherCompare on success', async () => {
    const { sut, encrypterStub } = makeSut();
    const spyEncrypt = jest.spyOn(encrypterStub, 'encrypt'); 
    await sut.auth(credentials);
    expect(spyEncrypt).toHaveBeenCalledWith(fakeAccount.id);
  });

  it('Should return null if encrypt Encrypter method returns null', async () => {
    const { sut, encrypterStub } = makeSut();
    jest .spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async ()=> {
      return new Promise(resolve => resolve(null));
    });
    const promise = await sut.auth(credentials);
    expect(promise).toBeNull();
  });

  it('Should throws if encrypt Encrypter method throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest .spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async ()=> {
      throw new Error();
    });
    const promise = sut.auth(credentials);
    await expect(promise).rejects.toThrow(); 
  });
});