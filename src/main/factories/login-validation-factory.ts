import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { Validation } from "../../validations/protocols/validation";
import { ValidationEmail } from "../../validations/validation-email";
import { ValidationRequireFields } from "../../validations/validation-require-fields.";
import { ValidationsComposite } from "../../validations/validations-composite";

export const makeLoginValidation  = (): Validation => {
  const validations: Validation[] = [];
  const emailValidator = new EmailValidatorAdapter();

  for(const field of ['email', 'password']) validations.push(new ValidationRequireFields(field));
  validations.push(new ValidationEmail('email', emailValidator));

  return new ValidationsComposite(validations);
}; 
