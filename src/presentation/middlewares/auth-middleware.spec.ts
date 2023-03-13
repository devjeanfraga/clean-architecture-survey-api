import { Validation, badRequest, AccessDeniedError, AccountModel, LoadAcccountByToken} from "./auth-middleware-protocols";
import { AuthMiddleware } from "./auth-middleware";

const fakeRequest = {
  headers: {
    'x-access-token': 'any-token'
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

const makeLoadAcccountByToken = (): LoadAcccountByToken => {
  class LoadAcccountByTokenStub implements LoadAcccountByToken {
    loadByToken(token: string, rule?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve({
        id: 'any-id',
        name: 'any-name',
        email: 'any-mail',
        password: 'any-password'
      })); 
    }
  }
  return new LoadAcccountByTokenStub();
}

interface SutTypes {
  sut: AuthMiddleware
  validationStub: Validation
  loadAcccountByTokenStub: LoadAcccountByToken
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const loadAcccountByTokenStub = makeLoadAcccountByToken();
  const sut = new AuthMiddleware(validationStub, loadAcccountByTokenStub);
  return {
    sut,
    validationStub,
    loadAcccountByTokenStub
  };
};

describe('AuthMiddleware', () => {
  it("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const spyValidate = jest.spyOn( validationStub, 'validate');

    await sut.handle(fakeRequest);
    expect(spyValidate).toHaveBeenCalledWith(fakeRequest.headers?.["x-access-token"]);
  });

  it("should return 403 if  Validation returns an Error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn( validationStub, 'validate').mockReturnValueOnce(new AccessDeniedError());

    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(badRequest(new AccessDeniedError()));
  });

  it('Should calls loadByToken LoadAcccountByToken with correct values', async () => {
      const { sut, loadAcccountByTokenStub } = makeSut();
      const spyLoadByToken = jest.spyOn( loadAcccountByTokenStub, 'loadByToken');
  
      await sut.handle(fakeRequest);
      expect(spyLoadByToken).toHaveBeenCalledWith(fakeRequest.headers?.["x-access-token"]);
  });
});