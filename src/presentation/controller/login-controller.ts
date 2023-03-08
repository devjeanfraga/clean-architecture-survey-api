import { Validation } from "../../validations/protocols/validation";
import { badRequest } from "../http-helpers/http-helpers";
import { Controller } from "../protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../protocols/protocol-http";

export class LoginController implements Controller {
  constructor (private readonly validation: Validation) {}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if ( error )  return badRequest(error);
    return null; 
  }
}