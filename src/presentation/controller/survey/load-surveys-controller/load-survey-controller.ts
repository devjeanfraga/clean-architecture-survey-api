import { Controller, HttpRequest, HttpResponse, LoadSurveys, ok, serverError } from "./load-surveys-controller-protocols";

export class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle(httpRequest: HttpRequest = {}): Promise<HttpResponse> {
    try {
      const listSurveys = await this.loadSurveys.load(); 
      return ok(listSurveys); 
    } catch (error) {
      return serverError(error);
    }
  }
}