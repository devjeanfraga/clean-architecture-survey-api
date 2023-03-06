import supertest from "supertest";
import app from "./src/main/config/app";

global.testRequest = supertest(app); 
global.fakeRequest = { 
  body: {
    name: "any-name",
    email: "any@mail.com",
    password: "any-password",
    confirmPassword: "any-password"
  }
};

global.fakeResponse = {
  statusCode: 200, 
  body: {
    id: "any-id",
    name: "any-name",
    email: "any@mail.com",
    password: "any-password",
  }
}; 