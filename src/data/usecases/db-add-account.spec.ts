import {DbAddAccount } from "./db-add-acount";
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository} from "./db-add-account-protocols";
import { AccountModel } from "../../domain/account-model";
import { AddAccountModel } from "../../domain/usecases/add-account";

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

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    hash(value: string): Promise<string> {
      return Promise.resolve('some-string'); 
    }
  }
  return new HasherStub(); 
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository{
    add(values: AddAccountModel): Promise<AccountModel> {
        return Promise.resolve({
          id: "any-id",
          name: "any-name",
          email: "any@mail.com",
          password: "any-encrypt-string"
        });  
    }
  }
  return new AddAccountRepositoryStub(); 
}

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository(); 
  const sut = new DbAddAccount(loadAccountByEmailRepositoryStub, hasherStub, addAccountRepositoryStub);
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  };
};

const params = {
  name: "valid-name",
  email: "valid-email",
  password: "valid-password"
};

describe("DbAddAccount Usecase", () => {
  it('Should call loadByEmail LoadAccountByEmailRepository method with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const spyLoadByEmail = jest .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(params);
    expect(spyLoadByEmail).toHaveBeenCalledWith(params.email);
  });

  it("Should calls encrypt by Encrypter with correct password ", async () => {
    const {sut, hasherStub} = makeSut();
    const encryptSpy = jest.spyOn(hasherStub, "hash");
    await sut.add(params); 
    expect(encryptSpy).toHaveBeenCalledWith(params.password);  
  });

  it("Should throws if Encrypter throws", async () => {
    const {sut, hasherStub} = makeSut();
    jest.spyOn(hasherStub, "hash").mockImplementationOnce(()=> {
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

  it("Should throws if AddAccountRepository throws", async () => {
    const {sut, addAccountRepositoryStub} = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add").mockImplementationOnce(()=> {
      throw new Error();
    });
    const response = sut.add(params); 
    await expect(response).rejects.toThrow();  
  });

  it("Should return an accoutn if AddAccountRepository on success", async () => {
    const { sut } = makeSut();

    const response = await sut.add(params);
    expect(response).toEqual({
      id: "any-id",
      name: "any-name",
      email: "any@mail.com",
      password: "any-encrypt-string"
    });
  }); 
});