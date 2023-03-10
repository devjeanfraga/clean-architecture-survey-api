import { Authentication } from "../../domain/usecases/authentication";
import { Validation } from "../../validations/protocols/validation";
import { anauthorized, badRequest, ok, serverError } from "../http-helpers/http-helpers";
import { Controller } from "../protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../protocols/protocol-http";

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
      if (! accessToken) return anauthorized();

      return ok({accessToken}); 
    } catch (error) {
      return serverError(error);
    }
  }
}