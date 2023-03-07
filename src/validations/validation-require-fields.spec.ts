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

});