import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash(): Promise<string> {
    return new Promise(resolve => resolve("hashed-password"));
  },

  compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true));
  }
}));

const makeSut = (): BcryptAdapter => {
  const salt = 12; 
  const sut = new BcryptAdapter(salt);
  return sut;
};
describe( "BcryptAdapter", () => {
  it("Should calls hash method with correct values", () => {
     const sut = makeSut();
     const salt = 12;
     const spyHash = jest.spyOn(bcrypt, "hash"); 
     sut.hash('any-password'); 
     expect(spyHash).toHaveBeenCalledWith("any-password", salt); 
  });

  it ("Should return a hashed password if hash on success", async () => {
    const sut = makeSut();
    const response = await sut.hash("any-password");
    expect(response).toBe("hashed-password"); 
  });

  it("Should throws if hash method throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => { throw new Error(); }); 
    const response = sut.hash('any-password'); 
    await expect(response).rejects.toThrow(); 
  });

  it("Should calls compare method with correct values", () => {
    const sut = makeSut();
    const spyCompare = jest.spyOn(bcrypt, 'compare'); 
    sut.compare('any-password', 'hashed-password'); 
    expect(spyCompare).toHaveBeenCalledWith("any-password", "hashed-password"); 
  });

  it ("Should return true if compare on success", async () => {
    const sut = makeSut();
    const response = await sut.compare('any-password', 'hashed-password');
    expect(response).toBe(true); 
  });

  it('Should return false when bcrypt compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(false));
    });

    const isValid = await sut.compare('any-value', 'hashed-value');
    expect(isValid).toBe(false);
  });

  it('Should throw if bcrypt compare throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.compare('any-value', 'hashed-value');
    expect(promise).rejects.toThrow();
  });

 });

