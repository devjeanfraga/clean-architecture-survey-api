import { Validation, badRequest, AccessDeniedError, AccountModel, LoadAcccountByToken, serverError, ok} from "./auth-middleware-protocols";
import { AuthMiddleware } from "./auth-middleware";

const fakeRequest = {
  headers: {
    'x-access-token': 'any-token'
  }
};

const fakeAccount = {
  id: 'any-id',
  name: 'any-name',
  email: 'any-mail',
  password: 'any-password'
}

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
      return new Promise(resolve => resolve(fakeAccount)); 
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
  const role = 'any-role';
  const sut = new AuthMiddleware(validationStub, loadAcccountByTokenStub, role);
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
      const role = 'any-role';
      await sut.handle(fakeRequest);
      expect(spyLoadByToken).toHaveBeenCalledWith(fakeRequest.headers?.["x-access-token"], role);
  });

  it("should return 403 if  loadByToken LoadAcccountByToken returns null", async () => {
    const { sut, loadAcccountByTokenStub } = makeSut();
    jest.spyOn( loadAcccountByTokenStub, 'loadByToken').mockImplementationOnce(async () => {
      return new Promise((resolve, rejects ) => resolve(null))
    });

    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(badRequest(new AccessDeniedError()));
  });

  it("should return 500 if  loadByToken LoadAcccountByToken throws", async () => {
    const { sut, loadAcccountByTokenStub } = makeSut();
    jest.spyOn( loadAcccountByTokenStub, 'loadByToken').mockImplementationOnce(async () => {
      throw new Error(); 
    });

    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(serverError(new Error()))
  });

  it("should return 200 if  loadByToken LoadAcccountByToken on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(ok({id: fakeAccount.id}))
  });
});