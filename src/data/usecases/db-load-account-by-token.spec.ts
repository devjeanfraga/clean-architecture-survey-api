import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { AccountModel, Decrypter, LoadAccountByTokenRepository } from "./db-load-account-by-token-protocols";


const token = 'any-token', role = 'any-role'
const fakeAccount = {
  id: 'any-id',
  name: 'any-name',
  email: 'any-mail',
  password: 'any-password'
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decipher(value: string): Promise<string> {
      return new Promise(resolve => resolve('any-string')); 
    }
  }
  return new DecrypterStub();
};

const makeLoadAcccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoaAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new LoaAccountByTokenRepositoryStub(); 
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loaAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loaAccountByTokenRepositoryStub = makeLoadAcccountByTokenRepository();
  const sut = new DbLoadAccountByToken(decrypterStub, loaAccountByTokenRepositoryStub); 
  return {
    sut,
    decrypterStub,
    loaAccountByTokenRepositoryStub
  };
};

describe('DbLoadAccountByToken', () => {
  it('Should call loadByToken LoaAccountByTokenRepository method with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const spyDecipher = jest.spyOn(decrypterStub, 'decipher');

    await sut.loadByToken(token);
    expect(spyDecipher).toHaveBeenLastCalledWith(token); 
  });

  it('Should return null if loadByToken LoaAccountByTokenRepository method returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decipher').mockReturnValueOnce(Promise.resolve(null));

    const promise = await sut.loadByToken(token);
    expect(promise).toBeNull(); 
  });

  it('Should call loadByToken LoaAccountByTokenRepository method with correct values', async () => {
    const { sut, loaAccountByTokenRepositoryStub } = makeSut();
    const spyLoadByToken = jest.spyOn(loaAccountByTokenRepositoryStub, 'loadByToken');

    await sut.loadByToken(token, role);
    expect(spyLoadByToken).toHaveBeenCalledWith('any-string', role);
  })
});