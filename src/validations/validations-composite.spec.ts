import { Validation } from "./protocols/validation";
import { ValidationsComposite } from "./validations-composite";

const makeValidation = (): Validation => {
  class ValidationStub  implements Validation {
    validate(input: any): Error {
      return null; 
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: ValidationsComposite;
  validations: Validation[];
}
const makeSut = (): SutTypes => {
  const validations = [ makeValidation(), makeValidation() ];
  const sut = new ValidationsComposite(validations);
  return {
    sut,
    validations
  }
};

describe('ValidationComposite', () => {
  it('Should return an Error if any Validation fails', () => {
    const { sut, validations } = makeSut();
    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(new Error());
    const error = sut.validate({field: 'any-field'}); 
    expect(error).toEqual(new Error); 
  })

  it("Should return null if Validations success", async () => {
    const { sut } = makeSut();
    const res = sut.validate({field: 'field'}); 
    expect(res).toBeFalsy(); 
  });
});