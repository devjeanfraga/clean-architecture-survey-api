import { SignUpController } from "./signup";
import {HttpRequest} from '../protocols/protocol-http';
import {badRequest,serverError, ok} from '../http-helpers/http-helpers';
import {MissingParamError} from '../errors/missing-param-error';
import {InvalidParamError} from '../errors/invalid-param-error';
import { AddAccount, AddAccountModel } from '../../domain/usecase/add-account'; 
import { AccountModel } from '../../domain/account-model';
import { EmailValidator } from '../../utils/email-validator';

const httpRequest: HttpRequest = {
  body: {
    name: 'any-name',
    email: 'any@mail',
    password: 'any-password',
    confirmPassword: 'any-password',
  }
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): Promise<boolean> {
      return Promise.resolve(true); 
    }
  }
  return new EmailValidatorStub(); 
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
  addAccountStub: AddAccount;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub 
  };
}
  


describe( "SignUp Controller", () => {

  it("Should return 400 if name is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email',
        password: 'any-password',
        confirmPassword: 'any-password'
      }
    };
    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  }); 

  it("Should return 400 if email is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        confirmPassword: 'any-password'
      }
    };

    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  }); 

  it("Should return 400 if password is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any@mail',
        confirmPassword: 'any-password'
      }
    };

    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password'))); 
  }); 

  it("Should return 400 if password is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any@mail',
        password: 'any-password'
      }
    };

    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('confirmPassword'))); 
  }); 

  it("Should return 400 if password is not equal confirmPassword", async () => {
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any@mail',
        password: 'any-password',
        confirmPassword:'diff-any-password'
      }
    };
    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('confirmPassword'))); 
  });

  it("Should return 400 if invalid email is provider", async () => {
      const {sut, emailValidatorStub} = makeSut();
      jest.spyOn( emailValidatorStub, 'isValid').mockReturnValueOnce(Promise.resolve(false));
      
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email'))); 
  });  

  it("Should calls isvalid method by Emailvalidator with correct values", async () => {
    const {sut, emailValidatorStub} = makeSut();
    const isValidSpy = jest.spyOn( emailValidatorStub, 'isValid')
    
    await sut.handle(httpRequest);
    const { email } = httpRequest.body
    expect(isValidSpy).toHaveBeenCalledWith(email); 
  });

  it("Should calls isvalid method by Emailvalidator with correct values", async () => {
    const {sut, emailValidatorStub} = makeSut();
    jest.spyOn( emailValidatorStub, 'isValid').mockImplementationOnce( async () => {
      return new Promise((resolve, reject) => reject(new Error())); 
    })
    
    const httpResponse = await sut.handle(httpRequest);
    
    expect(httpResponse).toEqual(serverError(new Error())); 
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