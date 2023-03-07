import { Validation } from "./protocols/validation";
import { InvalidParamError } from "../presentation/errors/invalid-param-error";

export class ValidationCompareFields implements Validation {
  constructor (
    private readonly field: string,
    private readonly compareField: string
    ) {}

    validate(input:any ): Error {
       if(input[this.field] !== input[this.compareField]) {
         return new InvalidParamError(this.field) 
       }
        
       return null;   
  }
}
