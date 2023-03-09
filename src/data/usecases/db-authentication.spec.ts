import { AccountModel } from "../../domain/account-model";
import { DbAuthentication } from "./db-authetication";
import { LoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import { HasherCompare } from "../protocols/hasher-compare";
import { Encrypter } from "../protocols/encrypter";
import { UpdateAccessTokenRepository } from "../protocols/update-access-token-repository";

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
        return new Promise(resolve => resolve('any-access-token'))
      }
    }
    return new EncrypterStub();
  };

  const makeUpdateAccesstokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async updateAccessToken(id: string, accessToken: string ): Promise<void> {
        return null; 
      }
    }
    return new UpdateAccessTokenRepositoryStub();
  };

 interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hasherCompareStub: HasherCompare;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
 } 
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hasherCompareStub = makeHasherCompare();
  const encrypterStub = makeEncrypterStub();
  const updateAccessTokenRepositoryStub = makeUpdateAccesstokenRepository(); 
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub, 
    hasherCompareStub, 
    encrypterStub, 
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hasherCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
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

  it('Should call updateAccessToken UpdateAccessTokenRepository method with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const spyEncrypt = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken'); 
    await sut.auth(credentials);
    expect(spyEncrypt).toHaveBeenCalledWith(fakeAccount.id,'any-access-token');
  });

  it('Should throw if updateAccessToken UpdateAccessTokenRepository method throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(() => {
      throw new Error(); 
    }); 
    const promise = sut.auth(credentials);
    await expect(promise).rejects.toThrow();
  });
  
  it('Should return accessToken if auth on success', async () => {
    const { sut } = makeSut();
    const promise = await sut.auth(credentials);
    expect(promise).toEqual('any-access-token');
  });
});



