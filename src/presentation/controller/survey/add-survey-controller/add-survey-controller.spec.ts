import { AddSurveyController } from "./add-survey-controller";
import { Validation, badRequest, AddSurveyModel, AddSurvey, serverError } from "./add-survey-controller-protocols";

const httpRequest = {
  body: {
    question: 'any-question',
    answers: [
      { answer: 'any-answer-01', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-02', image: 'http://localhost:8080/any-image'},
      { answer: 'any-answer-03'}
    ],
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

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add( data: AddSurveyModel ):Promise<void> {
      return null; 
    }
  }
  return new AddSurveyStub(); 
};

interface SutTypes {
  sut: AddSurveyController;
  validationsStub: Validation;
  addSurveyStub: AddSurvey;
}
const makeSut = (): SutTypes => {
  const validationsStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationsStub, addSurveyStub);
  return {
    sut,
    validationsStub,
    addSurveyStub
  };
};


describe('AddSurveyController', () => { 
  it('Shoul call validation with correct values', async () => {
    const {sut, validationsStub} = makeSut();
    const spyValidate = jest.spyOn( validationsStub, 'validate');

    await sut.handle(httpRequest);
    expect(spyValidate).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Shoul return an Error if validation returns some Error', async () => {
    const {sut, validationsStub} = makeSut();
    jest.spyOn( validationsStub, 'validate').mockReturnValueOnce(new Error());

    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new Error()));
  });

  it('Should call AddSurvey with correct values', async () => {
    const {sut, addSurveyStub} = makeSut();
    const spyAdd = jest.spyOn( addSurveyStub, 'add');

    await sut.handle(httpRequest);
    const date = new Date();
    const {question, answers } = httpRequest.body
    expect(spyAdd).toHaveBeenCalledWith({question, answers, date});
  });

  it('Should returns 500 if AddSurvey throws', async () => {
    const {sut, addSurveyStub} = makeSut();
    jest.spyOn( addSurveyStub, 'add').mockImplementationOnce(async () => {
      throw new Error();
    });

    const response = await sut.handle(httpRequest);
    expect(response).toEqual(serverError(new Error()));
  });

  it('Should return 204 if AddSurvey on success', async () => {
    const { sut } = makeSut();
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(204); 
  })
});