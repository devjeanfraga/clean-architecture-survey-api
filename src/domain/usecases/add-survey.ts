import { AnswersModel } from "../survey-model";

export interface AddSurveyModel {
  question: string;
  answers: AnswersModel[];
  date: Date;
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}