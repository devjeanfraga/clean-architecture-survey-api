import {  
  Controller, 
  forbidden, 
  HttpRequest, 
  HttpResponse, 
  InvalidParamError, 
  LoadSurveyById, 
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

      const survey = await this.loadSurveyById.load(surveyId);
      if (!survey) return forbidden(new InvalidParamError('surveyId'));

      const isValidAnswer = this.isValidAnswer(answer, survey.answers); 
      if(!isValidAnswer) return forbidden(new InvalidParamError('answer'));
      
      await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      });
      return null;
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