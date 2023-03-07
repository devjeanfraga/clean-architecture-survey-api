import { MissingParamError } from "../presentation/errors/missing-param-error";
import { ValidationRequireFields } from "./validation-require-fields.";

interface SutTypes { sut: ValidationRequireFields }
const makeSut = (): SutTypes => {
  const sut = new ValidationRequireFields('field');
  return { sut };
};

describe("ValidationRequireFields", () => {
  it("Should return MissingParamError if field missing", async () => {
    const { sut } = makeSut();
    const error = sut.validate({field: ''}); 
    expect(error).toEqual(new MissingParamError('field'));
  });
  
  it("Should return null if Validation success", async () => {
    const { sut } = makeSut();
    const res = sut.validate({field: 'field'}); 
    expect(res).toBeFalsy(); 
  })

});