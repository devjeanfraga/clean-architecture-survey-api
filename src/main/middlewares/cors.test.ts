import request from "supertest";
import app from "../config/app";

describe("Cors Middlewares", () => {
  it("Should enable Cors ", async () => {
    app.get('/cors-test', (req, res) => {
      res.send(); 
    });

    await request(app)
      .post('/cors-test')
      .expect("access-control-allow-origin","*")
      .expect("access-control-allow-method", "*")
      .expect("access-control-allow-headers", "*")
  });
}); 