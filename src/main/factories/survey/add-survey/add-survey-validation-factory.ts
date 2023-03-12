import { Validation } from "../../../../validations/protocols/validation";
import { ValidationRequireFields } from "../../../../validations/validation-require-fields.";
import { ValidationsComposite } from "../../../../validations/validations-composite";

export const makeAddSurveyValidation  = (): Validation => {
  const validations: Validation[] = [];
  for(const field of ['question', 'answers']) validations.push(new ValidationRequireFields(field));
  return new ValidationsComposite(validations);
}; 