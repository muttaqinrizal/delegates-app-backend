process.env.NODE_ENV = "test";

let axios = require("axios");
let mongoose = require("mongoose");
let User = require("../models/User");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

// let token = process.env.TEST_TOKEN
let rangerToken = "";
let token = "";

chai.use(chaiHttp);

before(done => {
  axios({
    method: "post",
    url: "http://localhost:3000/api/auth/login",
    data: {
      email: "rizalm57@gmail.com",
      password: "12345"
    }
  })
    .then(response => {
      rangerToken = response.data.token;
      done();
    })
    .catch(error => {
      console.error(error);
    });
});

before(done => {
  axios({
    method: "post",
    url: "http://localhost:3000/api/auth/login",
    data: {
      email: "munawarnabil5@gmail.com",
      password: "54321"
    }
  })
    .then(response => {
      token = response.data.token;
      done();
    })
    .catch(error => {
      console.error(error);
    });
});

describe("Users", () => {
  // clear databse each testing
  before(done => {
    User.deleteMany({}).then(() => {
      done();
    });
  });

  // get all users
  describe("Register a user", () => {
    it("should register a peserta", done => {
      chai
        .request(server)
        .post("/api/user/register")
        .set("Authorization", "Bearer " + token)
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("userId");
          res.body.should.have.property("scope").that.is.an("array");
          done();
        });
    });

    it("should register a panitia", done => {
      chai
        .request(server)
        .post("/api/user/register")
        .set("Authorization", "Bearer " + rangerToken)
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("userId");
          res.body.should.have.property("scope").that.is.an("array");
          done();
        });
    });
  });
});
