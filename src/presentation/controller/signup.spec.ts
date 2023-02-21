import { SignUpController } from "./signup";

describe( "SignUp Controller", () => {
  it("Should return 400 if name is not provider", () => {
    const sut = new SignUpController(); 
    const httpRequest = {
      email: 'any@email',
      password: 'any-password',
      confirmPassword: 'any-password'
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400); 
    expect(httpResponse.body).toEqual(new Error("Missing param: name"));
  }); 
})