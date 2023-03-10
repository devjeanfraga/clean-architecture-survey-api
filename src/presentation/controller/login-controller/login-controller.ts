import { 
  Authentication, 
  Validation, 
  anauthorized, 
  badRequest, 
  ok, 
  serverError, 
  HttpRequest, 
  HttpResponse, 
  Controller
} from "./login-controller-protocols";

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
    ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if ( error )  return badRequest(error);
      const accessToken = await this.authentication.auth(httpRequest.body);
      if (!accessToken) return anauthorized();

      return ok({accessToken}); 
    } catch (error) {
      return serverError(error);
    }
  }
}