import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest, ok, serverError } from '../http-helpers/http-helpers';
import {Controller} from '../protocols/protocol-controller';
import { HttpRequest, HttpResponse } from '../protocols/protocol-http';
import { AddAccount } from '../../domain/usecase/add-account'

export class SignUpController implements Controller {
  
  constructor (private readonly addAccount: AddAccount) {}

  async handle(httpResquest: HttpRequest): Promise<HttpResponse> {
   
    try {
      for (const field of ["name", "email", "password", "confirmPassword"]) {
        if( !httpResquest.body[field] ) return badRequest(new MissingParamError(field));
      } 
      
      if (httpResquest.body["password"] !== httpResquest.body["confirmPassword"]) return badRequest(new InvalidParamError("confirmPassword"))
      
      const {name, email, password} = httpResquest.body; 
      const account = await this.addAccount.add({ name, email, password}); 
      return ok(account);
    } catch (err) {
      return serverError(err);
    }
  }    
} 
