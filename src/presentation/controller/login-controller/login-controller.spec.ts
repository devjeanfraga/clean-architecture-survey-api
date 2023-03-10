import { LoginController } from "./login-controller";
import { AuthenticationModel } from "./login-controller-protocols";
import { InvalidParamError } from "../../errors";
import { 
  Authentication, 
  Validation, 
  anauthorized, 
  badRequest, 
  ok, 
  serverError, 
} from "./login-controller-protocols";


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
      
      return  new Promise(resolve => resolve('any-token')); 
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


  it("should return 401 Anauthorized if auth Authentication method returns null", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn( authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const res = await sut.handle(httpRequest);

    expect(res).toEqual(anauthorized());
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