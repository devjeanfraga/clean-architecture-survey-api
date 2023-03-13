import { AccessDeniedError, badRequest, HttpRequest, HttpResponse, LoadAcccountByToken, Middleware, Validation } from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByToken: LoadAcccountByToken
  ){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.headers?.['x-access-token']) 
    if (error) return badRequest(new AccessDeniedError());

    const token = httpRequest.headers?.['x-access-token']
    await this.loadAccountByToken.loadByToken(token);
    return null; 
  }
}