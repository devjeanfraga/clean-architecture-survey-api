import app from '../../../src/main/config/app'; 

describe("Content-type", () => {
  it("Should return default content-type json", async () => {
    app.get('/test-content-type-json', (req, res) => {
      res.send('');
    });

    await global.testRequest
      .get('/test-content-type-json')
      .expect('content-type', /json/); 
  })
})