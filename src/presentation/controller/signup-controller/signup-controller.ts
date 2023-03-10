import {
  Controller, 
  HttpRequest, 
  HttpResponse, 
  Validation, 
  AddAccount, 
  badRequest, 
  ok, 
  serverError,
  forbidden,
  EmailInUseError
} from './signup-controller-protocols';

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
      if (!account) return forbidden(new EmailInUseError());

      
 
      return ok(account);
    } catch (err) {
      return serverError(err);
    }
  }    
} 
