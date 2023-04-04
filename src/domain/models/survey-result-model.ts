export interface SurveyResultModel {
  surveyId: string;
  question: string;
  answers: SurveyAnswerModel[]; 
  date: Date;
}

interface SurveyAnswerModel {
  answer: string;
  image: string;
  count: number;
  percent: string;
  isCurrentAccountAnswer: boolean;
}

