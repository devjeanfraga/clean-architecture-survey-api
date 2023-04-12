import { Controller, forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, serverError } from "./load-survey-result-controller-protocols";

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try { 
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.load(surveyId);
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      return null

    } catch ( error ) {
      return serverError(error); 
    }
  }
}