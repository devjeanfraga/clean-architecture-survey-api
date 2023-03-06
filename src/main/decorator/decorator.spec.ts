import { serverError } from "../../presentation/http-helpers/http-helpers";
import { Controller } from "../../presentation/protocols/protocol-controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols/protocol-http"
import { LogErrorDecorator } from "./log-decorator";

const { fakeRequest, fakeResponse } = global;

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(fakeResponse)); 
    }
  }
  return new ControllerStub();
};

interface SutTypes {
  sut: LogErrorDecorator;
  controllerStub: Controller;
}

const  makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogErrorDecorator(controllerStub);
  return {
    sut,
    controllerStub
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
})