import { SignUpController } from "./signup";
import {HttpRequest} from '../protocols/protocol-http';
import {badRequest,serverError, ok} from '../http-helpers/http-helpers';
import {InvalidParamError} from '../errors/invalid-param-error';
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'; 
import { AccountModel } from '../../domain/account-model';
import { Validation } from "../../validations/protocols/validation";

jest.mock('../../validations/validations-composite.ts'); 

const httpRequest: HttpRequest = {
  body: {
    name: 'any-name',
    email: 'any@mail',
    password: 'any-password',
    confirmPassword: 'any-password',
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

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
     async add (values: AddAccountModel): Promise<AccountModel> {
      return new Promise( (resolve, rejects) => resolve({
          id: "any-id",
          name: "any-name",
          email: "any@email",
          password: "any-password"
        })
      );
     }
  }

  return new AddAccountStub(); 
}; 

interface SutTypes {
  sut: SignUpController; 
  validationStub: Validation;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(validationStub , addAccountStub);
  return {
    sut,
    validationStub,
    addAccountStub 
  };
}
  
describe( "SignUpController", () => {

  it("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const spyValidate = jest.spyOn( validationStub, 'validate');

    await sut.handle(httpRequest);
    expect(spyValidate).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return some Error if Validation returns an Error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn( validationStub, 'validate').mockReturnValueOnce( 
      new InvalidParamError('field')
    );

    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new InvalidParamError('field')));
  });
  
  it( "Shoud calls add method by AddAccount with correct values", async () => {
    const {sut, addAccountStub} = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add'); 

    await sut.handle(httpRequest); 
     expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any@mail',
      password: 'any-password',
    }); 
  });

  it("Should return 500 if add method by addAccount fails", async () => {
    const {sut, addAccountStub} = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce( async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error(null))); 
  }); 

  it("Should return 200 if add method by addAccount success", async () => {
    const {sut} = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({
      id: "any-id",
      name: "any-name",
      email: "any@email",
      password: "any-password",
    })); 
  }); 
}); 