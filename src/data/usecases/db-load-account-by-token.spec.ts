import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "./db-load-account-by-token-protocols";

const token = 'any-token';
const fakeAccount = {
  id: 'any-id',
  name: 'any-name',
  email: 'any-mail',
  password: 'any-password'
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decipher(value: string): Promise<string> {
      return null; 
    }
  }
  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub); 
  return {
    sut,
    decrypterStub
  };
};

describe('DbLoadAccountByToken', () => {
  it('Should call loadByToken LoaAccountByTokenRepository method with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const spyDecipher = jest.spyOn(decrypterStub, 'decipher');

    await sut.loadByToken(token);
    expect(spyDecipher).toHaveBeenLastCalledWith(token); 
  })
});