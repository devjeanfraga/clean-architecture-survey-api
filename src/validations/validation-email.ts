import { InvalidParamError } from "../presentation/errors/invalid-param-error";
import { EmailValidator } from "../presentation/protocols/email-validator";
import { Validation } from "./protocols/validation";

export class ValidationEmail implements Validation {
  constructor (
    private readonly field: string,
    private readonly emailValidator: EmailValidator,
    ){}

  validate(input: any): InvalidParamError {
    const isEmail = this.emailValidator.isValid(input[this.field]);
    if ( !isEmail ) {
      return new InvalidParamError(this.field);
    }
    return null; 
  }
}