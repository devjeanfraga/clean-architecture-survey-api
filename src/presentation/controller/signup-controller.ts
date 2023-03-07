import { badRequest, ok, serverError } from '../http-helpers/http-helpers';
import {Controller} from '../protocols/protocol-controller';
import { HttpRequest, HttpResponse } from '../protocols/protocol-http';
import { AddAccount } from '../../domain/usecases/add-account';
import { Validation } from '../../validations/protocols/validation';


export class SignUpController implements Controller {
  
  constructor (
    private readonly validations: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async handle(httpResquest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validations.validate(httpResquest.body);
      if(error) return badRequest(error);

      const {name, email, password} = httpResquest.body; 
      const account = await this.addAccount.add({ name, email, password});

      return ok(account);
    } catch (err) {
      return serverError(err);
    }
  }    
} 
