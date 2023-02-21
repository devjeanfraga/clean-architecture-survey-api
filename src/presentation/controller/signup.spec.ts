import { SignUpController } from "./signup";

describe( "SignUp Controller", () => {
  const sut = new SignUpController();

  it("Should return 400 if name is not provider", () => {
    const httpRequest = {
      email: 'any@email',
      password: 'any-password',
      confirmPassword: 'any-password'
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400); 
    expect(httpResponse.body).toEqual(new Error("Missing param: name"));
  }); 

  it("Should return 400 if email is not provider", () => {
    const httpRequest = {
      name: 'any-name',
      password: 'any-password',
      confirmPassword: 'any-password'
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing param: email"))
  })
})