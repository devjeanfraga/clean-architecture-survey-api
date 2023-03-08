import { Validation } from "../../validations/protocols/validation";
import { LoginController } from "./login-controller";

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

interface SutTypes {
  sut: LoginController;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new LoginController(validationStub);
  return {
    sut,
    validationStub
  };
};

describe('LoginController', () => {
  it("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const spyValidate = jest.spyOn( validationStub, 'validate');

    await sut.handle(httpRequest);
    expect(spyValidate).toHaveBeenCalledWith(httpRequest.body);
  });
}); 