import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../http-helpers/http-helpers';
import {Controller} from '../protocols/protocol-controller';
import { HttpRequest, HttpResponse } from '../protocols/protocol-http';

export class SignUpController implements Controller {
  handle(httpResquest: HttpRequest): Promise<HttpResponse> {
   
    for (const field of ["name", "email", "password", "confirmPassword"]) {
      if( !httpResquest.body[field] ) return new Promise((resolve, reject) => resolve(badRequest(new MissingParamError(field))))
    }
    return null; 
  }    
} 
