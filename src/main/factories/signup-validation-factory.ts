import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { Validation } from "../../validations/protocols/validation";
import { ValidationCompareFields } from "../../validations/validation-compare-fields";
import { ValidationEmail } from "../../validations/validation-email";
import { ValidationRequireFields } from "../../validations/validation-require-fields.";
import { ValidationsComposite } from "../../validations/validations-composite";

export const makeSignUpValidation = (): ValidationsComposite => {
  const validations: Validation[] = [];
  
  const fields = ['name', 'email', 'password', 'confirmPassword']
  for ( const field of fields ) validations.push(new ValidationRequireFields(field));
  
  const emailValidator =  new EmailValidatorAdapter();
  validations.push(new ValidationEmail('email', emailValidator));
  validations.push(new ValidationCompareFields('password', 'confirmPassword'));

  return new ValidationsComposite(validations); 
};