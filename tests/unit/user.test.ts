import { expect } from 'chai';
import { describe, before } from 'mocha';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

let newAdmin = {
  name: "Powell",
  emailId: "PaperBag@gmail.com",
  password: "Balance@bro"
};

let forgetToken = "";
let newUser = {
  name: "Helan",
  department: "Civil",
  designation: "Structural Engineer"
}
let loginToken = "";

describe('User APIs Test', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  describe('Create Admin', () => {
    it('should create a new user and return 201 status with success message', (done) => {
      request(app.getApp())
        .post('/api/v1/admin/signup')
        .send(newAdmin)
        .expect(201)
        .end((err, res) => {
          if(err){
            console.error("Error:", err.message);
            return done(err);
          };
          expect(res.body).to.have.property("message").that.equals("User created successfully");

          done();
        });
    });
  });

  describe("Login Admin", () => {
    it('should log in the user created above and return the 200 status with a token', (done) => {
        const LoginDetails = {
          emailId: newAdmin.emailId,
          password: newAdmin.password
        };
        request(app.getApp())
        .post('/api/v1/admin/login')
        .send(LoginDetails)
        .expect(200)
        .end((err, res) => {
          if(err){
            console.error("Error:", err.message);
            return done(err);
          }

          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property("message").that.equals("Login Successfull");
          loginToken = res.body.data.token;
          done();
        })
      });

  });

  describe('Forget Password', () => {
    it("should generate the reset token to reset the password", (done) => {
      const forgetDetails = {
        emailId: newAdmin.emailId
      };
      request(app.getApp())
        .post('/api/v1/admin/forgetpassword')
        .send(forgetDetails)
        .expect(200)
        .end((err, res) => {
          forgetToken = res.body.data
          if(err){
            console.error("Error:", err.message, forgetToken);
            return done(err);
          }
          expect(res.body).to.have.property("message").that.equals("Mail sent");
          done();
        })
    })
  });

  describe("Create User", () => {
    it("should create a new user",
    (done) => {
      request(app.getApp())
        .post('/api/v1/users/')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(newUser)
        .expect(201)
        .end((err, res) => {
          if(err){
            console.error("Error:", err.message);
            return done(err);
          };
          expect(res.body).to.have.property("message").that.equals("User created successfully");

          done();
        })
    })
  });

  describe("Update User", () => {
    it('should update details of existing User', (done) => {
      request(app.getApp())
      .put('/api/v1/users/')
      .set('Authorization', `Bearer ${loginToken}`)
      .send({name: "trialName"})
      .expect(200)
      .end((err, res) => {
        if(err){
          console.error("Error:", err.message);
          return done(err);
        }
        expect(res.body).to.have.property("message").that.equals("User updated");

        done();
      })
    })
  });

  describe("Get User", () =>{
    it('should get the user detail', (done) =>{
      request(app.getApp())
      .get('/api/v1/users/all')
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(200)
      .end((err, res) =>{
        if(err){
          console.error("Error:", err.message);
          return done(err);
        }
        expect(res.body).to.have.property("message").that.equals("Users fetched");
        done();
      })
    })
  });


  });
