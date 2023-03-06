import { resolve } from "path";
import { serverError } from "../../presentation/http-helpers/http-helpers";
import { Controller } from "../../presentation/protocols/protocol-controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http"
import { LogErrorDecorator } from "./log-error-decorator";
import { LogErrorRepository } from "../../data/protocols/log-error-repository";

const { fakeRequest, fakeResponse } = global;

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(fakeResponse)); 
    }
  }
  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    logError(stack: string): Promise<void> {
      return null;
    }
  }
  return new LogErrorRepositoryStub();
}

interface SutTypes {
  sut: LogErrorDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const  makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogErrorDecorator(controllerStub, logErrorRepositoryStub);
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  };
};  

describe("LogErrorDecorator", () => {
  it("Should call handle method of controller", async () => {
    const {sut, controllerStub} = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    
    await sut.handle(fakeRequest);
    expect(handleSpy).toHaveBeenCalledWith(fakeRequest);
  });

  it("Should return the same response of controller", async () => {
    const {sut} = makeSut();
    const res = await sut.handle(fakeRequest);
    expect(res).toEqual(fakeResponse)
  });

  it("Should call logError LogErrorRepository if LogErrorDecorator return 500", async () => {
    const {sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const spyLogError = jest.spyOn(logErrorRepositoryStub, 'logError');
    
    const error = new Error(); 
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce( () => {
      return new Promise(resolve => resolve(serverError(error)))
    } );

    await sut.handle(fakeRequest);
    expect(spyLogError).toHaveBeenCalledWith(serverError(error).body.stack);
  })
})