import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { Controller } from "../../presentation/protocols/protocol-controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http";

export class LogErrorDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    const res = await this.controller.handle(httpRequest);
    if(res.statusCode === 500) {
      await this.logErrorRepository.logError(res.body.stack);
    }
    return res;
  }
}