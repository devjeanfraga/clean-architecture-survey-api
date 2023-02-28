import bcrypt from 'bcrypt';
import { Hasher } from '../data/protocols/hasher';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash(): Promise<string> {
    return new Promise(resolve => resolve("hashed-password"));
  }
}));

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    hash(value: string): Promise<string> { return Promise.resolve("hashed-password"); }
  }
  return new HasherStub();
};

interface SutTypes {
  sut: BcryptAdapter;
  hasherStub: Hasher;
}

const makeSut = (): SutTypes => {
  const salt = 12; 
  const hasherStub = makeHasher();
  const sut = new BcryptAdapter(salt);
  return {
    sut,
    hasherStub
  };

}
describe( "BcryptAdapter", () => {
  it("Should calls hash method with correct values", () => {
     const {sut} = makeSut();
     const salt = 12;
     const hashSpy = jest.spyOn(bcrypt, "hash"); 
     sut.hash('any-password'); 
     expect(hashSpy).toHaveBeenCalledWith("any-password", salt); 
  });

  it ("Should return a hashed password if hash on success", async () => {
    const {sut} = makeSut();
    const response = await sut.hash("any-password");
    expect(response).toBe("hashed-password"); 
  });

  it("Should throws if hash method throws", async () => {
    const {sut} = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => { throw new Error(); }); 
    const response = sut.hash('any-password'); 
    await expect(response).rejects.toThrow(); 
  });
 });

