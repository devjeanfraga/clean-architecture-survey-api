import request from 'supertest';
import app from '../config/app'; 

describe("Content-type", ()=> {
  it("Should return default content-type json", async () => {
    app.get('/test-content-type-json', (req, res) => {
      res.send('');
    });

    await request(app)
      .get('/test-content-type-json')
      .expect('content-type', /json/); 
  })
})