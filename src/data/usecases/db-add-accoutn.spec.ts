import {DbAddAccount } from "../usecases/db-add-acount";
import { Encrypter } from "../protocols/encrypter";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt(value: string): Promise<string> {
      return Promise.resolve('some-string'); 
    }
  }
  return new EncrypterStub(); 
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub
  }
}
const params = {
  name: "valid-name",
  email: "valid-email",
  password: "valid-password"
};
describe("DbAddAccount Usecase", () => {
  it("Should calls encrypt by Encrypter with correct password ", async () => {
    const {sut, encrypterStub} = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.add(params); 
    expect(encryptSpy).toHaveBeenCalledWith(params.password);  
  });

  it("Should throws if Encrypter throws", async () => {
    const {sut, encrypterStub} = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce(()=> {
      throw new Error();
    });
    const response = sut.add(params); 
    await expect(response).rejects.toThrow();  
  });
});