import bcrypt from 'bcrypt';
import { Hasher } from '../../data/protocols/hasher';
import { HasherCompare } from '../../data/protocols/hasher-compare';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash(): Promise<string> {
    return new Promise(resolve => resolve("hashed-password"));
  },

  compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }
}));

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher, HasherCompare {

    hash(value: string): Promise<string> { 
      return Promise.resolve("hashed-password"); 
    }

    compare(value: string, encrypted: string): Promise<boolean> {
      return Promise.resolve(true);
    }
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
     const spyHash = jest.spyOn(bcrypt, "hash"); 
     sut.hash('any-password'); 
     expect(spyHash).toHaveBeenCalledWith("any-password", salt); 
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

  it("Should calls compare method with correct values", () => {
    const {sut} = makeSut();
    const spyCompare = jest.spyOn(bcrypt, 'compare'); 
    sut.compare('any-password', 'hashed-password'); 
    expect(spyCompare).toHaveBeenCalledWith("any-password", "hashed-password"); 
  });


 });

