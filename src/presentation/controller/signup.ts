import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../http-helpers/http-helpers';
import {Controller} from '../protocols/protocol-controller';
import { HttpRequest, HttpResponse } from '../protocols/protocol-http';

interface AccountModel {
  id: string;
  name: string;
  email: string;
  password: string;
} 

interface AddAccountModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} 

interface AddAccount {
  add (values: AddAccountModel): Promise<AccountModel>
}


export class SignUpController implements Controller {
  
  constructor (private readonly addAccount: AddAccount) {

  }

  async handle(httpResquest: HttpRequest): Promise<HttpResponse> {
   
    for (const field of ["name", "email", "password", "confirmPassword"]) {
      if( !httpResquest.body[field] ) return new Promise((resolve, reject) => resolve(badRequest(new MissingParamError(field))))
    } 
    const {name, email, password, confirmPassword} = httpResquest.body; 
    await this.addAccount.add({ name, email, password, confirmPassword }); 
    return null; 
  }    
} 
