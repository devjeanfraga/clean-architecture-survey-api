import { AccessDeniedError, badRequest, HttpRequest, HttpResponse, Middleware, Validation } from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly validation: Validation
  ){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.headers?.['x-access-token']) 
    if (error) return badRequest(new AccessDeniedError());

    return null; 
  }
}