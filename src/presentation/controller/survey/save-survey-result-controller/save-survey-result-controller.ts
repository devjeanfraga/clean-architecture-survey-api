import {  
  Controller, 
  forbidden, 
  HttpRequest, 
  HttpResponse, 
  InvalidParamError, 
  LoadSurveyById, 
  ok, 
  SaveSurveyResult, 
  serverError 
} from "./save-survey-result-controller-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ){
    this.isValidAnswer = this.isValidAnswer.bind(this);
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;
      console.log(accountId)

      const survey = await this.loadSurveyById.load(surveyId);
      if (!survey) return forbidden(new InvalidParamError('surveyId'));

      const isValidAnswer = this.isValidAnswer(answer, survey.answers); 
      if(!isValidAnswer) return forbidden(new InvalidParamError('answer'));
      
      const data = {
        surveyId,
        accountId,
        answer,
        date: new Date()
      }
      const savedSurveyResult = await this.saveSurveyResult.save(data);
      
      return ok(savedSurveyResult);
    } catch (error) {
      return serverError(error); 
    }

  }

  private isValidAnswer ( answer: string, answersList: any): boolean {
    for (const item of answersList ) {
      if (item.answer === answer) return true;      
    }
    return false; 
  }
}