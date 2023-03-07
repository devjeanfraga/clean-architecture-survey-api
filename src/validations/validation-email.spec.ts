import { InvalidParamError } from "../presentation/errors/invalid-param-error";
import { EmailValidator } from "../presentation/protocols/email-validator";
import { ValidationEmail } from "./validation-email";

const makeEmailvalidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true; 
    }
  }
  return new EmailValidatorStub(); 
};

interface SutTypes { 
  sut: ValidationEmail;
  emailValidatorStub: EmailValidator  
}
const makeSut = (): SutTypes => {
  const emailValidatorStub =  makeEmailvalidator();
  const sut = new ValidationEmail("email", emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe("ValidationEmail", () => {
  it("Should calls isValid method with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const spyIsValid = jest.spyOn( emailValidatorStub, 'isValid' );
    sut.validate({email: 'any@mail.com'}); 
    expect(spyIsValid).toHaveBeenCalledWith('any@mail.com'); 
  });

  it("Should return MissingParamError if isValid method return false", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn( emailValidatorStub, 'isValid' ).mockReturnValueOnce(false);

    const error = sut.validate({email: 'any.mail.com'}); 
    expect(error).toEqual(new InvalidParamError('email'));
  });

});