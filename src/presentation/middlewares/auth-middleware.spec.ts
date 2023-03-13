import { Validation, badRequest, AccessDeniedError} from "./auth-middleware-protocols";
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
}

interface SutTypes {
  sut: AuthMiddleware
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AuthMiddleware(validationStub);
  return {
    sut,
    validationStub
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
});