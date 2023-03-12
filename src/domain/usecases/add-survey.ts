export interface AnswersModel {
  answer: string;
  img?: string; 
} 

export interface AddSurveyModel {
  question: string;
  answers: AnswersModel[];
  date: string;
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<void>
}