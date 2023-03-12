import { AddSurveyController } from "./add-survey-controller";
import { Validation } from "./add-survey-controller-protocols";

const httpRequest = {
  body: {
    question: 'any-question',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ] 
  }
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null; 
    }
  }
  return new ValidationStub(); 
};


interface SutTypes {
  sut: AddSurveyController;
  validationsStub: Validation;
}
const makeSut = (): SutTypes => {
  const validationsStub = makeValidation();
  const sut = new AddSurveyController(validationsStub);
  return {
    sut,
    validationsStub
  };
};


describe('AddSurveyController', () => { 
  it('Shoul call validation with correct values', async () => {
    const {sut, validationsStub} = makeSut();
    const spyValidate = jest.spyOn( validationsStub, 'validate');

    await sut.handle(httpRequest);
    expect(spyValidate).toHaveBeenCalledWith(httpRequest.body);
  });
});