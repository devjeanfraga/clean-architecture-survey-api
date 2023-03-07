import { InvalidParamError } from "../presentation/errors/invalid-param-error";
import { EmailValidator } from "../presentation/protocols/email-validator";
import { Validation } from "./protocols/validation";

export class ValidationEmail implements Validation {
  constructor (
    private readonly field: string,
    private readonly emailValidator: EmailValidator,
    ){}

  validate(input: any): InvalidParamError {
    this.emailValidator.isValid(input[this.field]);
    return null; 
  }
}