import { Controller } from "../../presentation/protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http";

export class LogDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    const res = await this.controller.handle(httpRequest);
    return res;
  }
}