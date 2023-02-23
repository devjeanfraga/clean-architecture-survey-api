import { SignUpController } from "./signup";
import {HttpRequest, HttpResponse} from '../protocols/protocol-http';
import {badRequest,serverError, ok} from '../http-helpers/http-helpers';
import {MissingParamError} from '../errors/missing-param-error';


interface AccountModel {
  id: string;
  name: string;
  email: string;
  password: string;
} 

interface AddAccountModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} 

interface AddAccount {
  add (values: AddAccountModel):Promise<AccountModel>
}

const httpRequest: HttpRequest = {
  body: {
    name: 'any-name',
    email: 'any@mail',
    password: 'any-password',
    confirmPassword: 'any-password',
  }
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
     async add (values: AddAccountModel): Promise<AccountModel> {
      return new Promise( (resolve, rejects) => resolve({
          id: "any-id",
          name: "any-name",
          email: "any-email",
          password: "any-password"
        })
      );
     }
  }

  return new AddAccountStub(); 
}; 

interface SutTypes {
  sut: SignUpController; 
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(addAccountStub);
  return {
    sut,
    addAccountStub 
  };
}
  


describe( "SignUp Controller", () => {

  it("Should return 400 if name is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email',
        password: 'any-password',
        confirmPassword: 'any-password'
      }
    };
    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  }); 

  it("Should return 400 if email is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        confirmPassword: 'any-password'
      }
    };

    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  }); 

  it("Should return 400 if password is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any@mail',
        confirmPassword: 'any-password'
      }
    };

    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password'))); 
  }); 

  it("Should return 400 if password is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any@mail',
        password: 'any-password'
      }
    };

    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('confirmPassword'))); 
  }); 

  it( "Shoud calls add method by AddAccount with correct values", async () => {
    const {sut, addAccountStub} = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add'); 

    await sut.handle(httpRequest); 
     expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any@mail',
      password: 'any-password',
      confirmPassword: 'any-password',
    }); 
  });

}); 