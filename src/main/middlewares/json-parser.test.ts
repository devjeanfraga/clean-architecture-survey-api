import request from 'supertest';
import app from '../config/app';

describe("Json-parser Middleware", () => {
  it("Should parse body as a json", async () => {
    app.post('/test-json-parser', (req, res) => {
      res.send(req.body);
    });

    await request(app)
    .post('/test-json-parser')
    .send({name: "Jean"})
    .expect({name: "Jean"})
  });
});