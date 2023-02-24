import validator from 'validator'; 
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true; 
  } 
}));

const makeSut = (): EmailValidatorAdapter => {
  const sut = new EmailValidatorAdapter();
  return sut; 
}; 

describe ("EmailValidatorAdapter", () => {

  it("Should return false if validator return false", () => {
    const sut = makeSut();
     jest.spyOn( validator, 'isEmail').mockReturnValueOnce(false); 

    const output = sut.isValid('any-invalid@mail.com');
    expect(output).toBe(false); 
  });

  it("Should return true if validator return true", () => {
    const sut = makeSut();
    const output = sut.isValid('any@mail.com');
    expect(output).toBe(true); 
  });
});