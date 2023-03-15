export interface AnswersModel {
  answer: string;
  image?: string; 
} 

export interface SurveyModel {
  id: string;
  question: string;
  answers: AnswersModel[];
  date: Date;
} 

