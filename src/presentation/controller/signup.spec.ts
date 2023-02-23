import { SignUpController } from "./signup";
import {HttpRequest, HttpResponse} from '../protocols/protocol-http';
import {badRequest} from '../http-helpers/http-helpers';
import {MissingParamError} from '../errors/missing-param-error';

describe( "SignUp Controller", () => {
  const sut = new SignUpController();


  it("Should return 400 if name is not provider", async () => {
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email',
        password: 'any-password',
        confirmPassword: 'any-password'
      }
    };

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
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('confirmPassword'))); 
  })
}); 