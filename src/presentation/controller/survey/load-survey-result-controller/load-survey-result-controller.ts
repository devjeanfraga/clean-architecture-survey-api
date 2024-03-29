import { Controller, forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, LoadSurveyResult, ok, serverError } from "./load-survey-result-controller-protocols";

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try { 
      const { surveyId } = httpRequest.params;
      const { accountId } = httpRequest;

      const survey = await this.loadSurveyById.load(surveyId);
      if (!survey) return forbidden(new InvalidParamError('surveyId'));
      
      const surveyResult = await this.loadSurveyResult.load(survey.id, accountId); 
      return ok(surveyResult); 

    } catch ( error ) {
      return serverError(error); 
    }
  }
}