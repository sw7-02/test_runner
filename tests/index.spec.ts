import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/index";

chai.use(chaiHttp);

/*
describe("testing routes", function () {
    it("test route", async function () {
        return chai
            .request(app)
            .post("/")
            .then((res, done) => {
                chai.expect(res.status).to.eql(200);
                done();
            });
    });
});
*/
/*
describe('testing routes', function () {
    it('test route', async function () {
      const res = await chai.request(app).get('/');
      chai.expect(res.status).to.eql(200);
    });
  });
  */
