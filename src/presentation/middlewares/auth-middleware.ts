import { HttpRequest, HttpResponse, Middleware, Validation } from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly validation: Validation
  ){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.headers?.['x-access-token']) 
    return null; 
  }
}