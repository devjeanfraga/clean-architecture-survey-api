import { Validation } from "../../validations/protocols/validation";
import { Controller } from "../protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../protocols/protocol-http";

export class LoginController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    return null; 
  }
}