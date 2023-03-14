export interface AnswersModel {
  answer: string;
  img?: string; 
} 

export interface SurveyModel {
  id: string;
  question: string;
  answers: AnswersModel[];
  date: Date;
} 

