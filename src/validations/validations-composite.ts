import { Validation } from "./protocols/validation";

export class ValidationsComposite implements Validation {
  constructor (
    private readonly validationsList: Validation[]
  ) {}

  validate(input: any): Error {
    for (const validation of this.validationsList) {
      const error: Error = validation.validate(input);
      if(error) return error; 
    } 
  }
}