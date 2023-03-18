import { SignUpController } from "./signup-controller";
import { AccountModel } from '../../../domain/models/account-model';
import { InvalidParamError } from '../../errors';
import {
  HttpRequest, 
  Validation, 
  AddAccount, 
  badRequest, 
  ok, 
  serverError,
  forbidden,
  Authentication, 
  AuthenticationModel,
  EmailInUseError,
  AddAccountModel
} from './signup-controller-protocols';

jest.mock('../../../validations/validations-composite.ts'); 

const httpRequest: HttpRequest = {
  body: {
    name: 'any-name',
    email: 'any@mail',
    password: 'any-password',
    confirmPassword: 'any-password',
  }
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null; 
    }
  }
  return new ValidationStub(); 
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
     async add (values: AddAccountModel): Promise<AccountModel> {
      return new Promise( (resolve, rejects) => resolve({
          id: "any-id",
          name: "any-name",
          email: "any@email",
          password: "any-password"
        })
      );
     }
  }

  return new AddAccountStub(); 
}; 

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(credentials: AuthenticationModel): Promise<string> {
      
      return  new Promise(resolve => resolve('any-token')); 
    }
  }
  return new AuthenticationStub();
}; 

interface SutTypes {
  sut: SignUpController; 
  validationStub: Validation;
  addAccountStub: AddAccount;
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addAccountStub = makeAddAccount();
  const authenticationStub = makeAuthentication();
  const sut = new SignUpController(validationStub , addAccountStub, authenticationStub);
  return {
    sut,
    validationStub,
    addAccountStub,
    authenticationStub 
  };
}
  
describe( "SignUpController", () => {

  it("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const spyValidate = jest.spyOn( validationStub, 'validate');

    await sut.handle(httpRequest);
    expect(spyValidate).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return some Error if Validation returns an Error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn( validationStub, 'validate').mockReturnValueOnce( 
      new InvalidParamError('field')
    );

    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new InvalidParamError('field')));
  });
  
  it( "Shoud calls add method by AddAccount with correct values", async () => {
    const {sut, addAccountStub} = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add'); 

    await sut.handle(httpRequest); 
     expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any@mail',
      password: 'any-password',
    }); 
  });

  it("Should return 500 if add method by addAccount fails", async () => {
    const {sut, addAccountStub} = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce( async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error(null))); 
  }); 

  it("Should return 403 if add method by addAccount returns null", async () => {
    const {sut, addAccountStub} = makeSut();
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new EmailInUseError())); 
  });  

  it("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const spyAuth = jest.spyOn( authenticationStub, 'auth');

    await sut.handle(httpRequest);
    const { email, password } = httpRequest.body;
    expect(spyAuth).toHaveBeenCalledWith({email, password});
  });

  it("should return 500 if auth Authentication method fails", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn( authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const res = await sut.handle(httpRequest);

    expect(res).toEqual(serverError(new Error()));
  });

  it('Should return a token if auth Authentication method on succes', async () => {
    const { sut } = makeSut();
    const res = await sut.handle(httpRequest);
    expect(res).toEqual(ok({accessToken: 'any-token'}));
  });
}); 