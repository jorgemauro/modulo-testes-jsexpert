const { describe, it, after, before } = require("mocha");
const supertest = require("supertest");
const assert = require("assert");
const carCategory=require('./../mocks/valid-carCategory.json')
describe("API Suite test", () => {
  let app;
  before((done) => {
    app = require("./api");
    app.once("listening", done);
  });

  after((done) => app.close(done));

  describe("/car_categories", () => {
    it("should request the contact route and return HTTP Status 200", async () => {
      const response = await supertest(app).get("/car_categories").expect(200);
      console.log('response',response.text)
      assert.strictEqual(response.text, carCategory);
    });
  });
});
