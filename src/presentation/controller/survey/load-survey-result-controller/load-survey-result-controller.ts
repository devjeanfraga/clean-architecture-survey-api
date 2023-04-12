import { Controller, forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById } from "./load-survey-result-controller-protocols";

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params;
    const survey = await this.loadSurveyById.load(surveyId);
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return null
  }
}