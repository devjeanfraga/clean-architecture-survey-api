import {DbAddAccount } from "../usecases/db-add-acount";
import { Encrypter } from "../protocols/encrypter";
import { AddAccountRepository } from "../protocols/add-account-repository";
import { AccountModel } from "../../domain/account-model";
import { AddAccountModel } from "../../domain/usecases/add-account";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt(value: string): Promise<string> {
      return Promise.resolve('some-string'); 
    }
  }
  return new EncrypterStub(); 
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository{
    add(values: AddAccountModel): Promise<AccountModel> {
        return null; 
    }
  }
  return new AddAccountRepositoryStub(); 
}

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository(); 
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  };
};
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

  it("Should calls add by AddAccountRepository with correct values ", async () => {
    const {sut, addAccountRepositoryStub} = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    await sut.add(params); 
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid-name",
      email: "valid-email",
      password: "some-string"
    });  
  });

});