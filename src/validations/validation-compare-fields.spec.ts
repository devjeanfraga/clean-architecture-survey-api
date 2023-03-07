import { InvalidParamError } from "../presentation/errors/invalid-param-error";
import { ValidationCompareFields } from "./validation-compare-fields";

interface SutTypes { sut: ValidationCompareFields }
const makeSut = (): SutTypes => {
  const sut = new ValidationCompareFields('field', 'fieldToCompare');
  return { sut };
};

describe("ValidationCompareFields", () => {
  it("Should return InvalidParamError if field is not equal compareField", async () => {
    const { sut } = makeSut();
    const error = sut.validate({field: "any-field", fieldToCompare: 'any-compare-field'}); 
    expect(error).toEqual(new InvalidParamError("field"));
  });

  it("Should return null if Validation success", async () => {
    const { sut } = makeSut();
    const res = sut.validate({field: "any-field", fieldToCompare: 'any-field'}); 
    expect(res).toBeFalsy(); 
  })
});

