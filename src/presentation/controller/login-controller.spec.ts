import { Validation } from "../../validations/protocols/validation";
import { LoginController } from "./login-controller";
import { InvalidParamError } from "../errors/invalid-param-error";
import { badRequest, serverError } from "../http-helpers/http-helpers";
import { Authentication, AuthenticationModel } from "../../domain/usecases/authentication";


const httpRequest = {
  body: {
    email: 'any@mail.com',
    password: 'any-password'
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

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(credentials: AuthenticationModel): Promise<string> {
      return null; 
    }
  }
  return new AuthenticationStub();
}; 

interface SutTypes {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(validationStub, authenticationStub);
  return {
    sut,
    validationStub,
    authenticationStub
  };
};

describe('LoginController', () => {
  it("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const spyValidate = jest.spyOn( validationStub, 'validate');

    await sut.handle(httpRequest);
    expect(spyValidate).toHaveBeenCalledWith(httpRequest.body);
  });

  
  it("should return an Error if Validation returns some Error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn( validationStub, 'validate').mockReturnValueOnce( 
      new InvalidParamError('field')
    );

    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new InvalidParamError('field')));
  });

  it("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const spyAuth = jest.spyOn( authenticationStub, 'auth');

    await sut.handle(httpRequest);

    expect(spyAuth).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 500 if auth Authentication method fails", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn( authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const res = await sut.handle(httpRequest);

    expect(res).toEqual(serverError(new Error()));
  });
}); 