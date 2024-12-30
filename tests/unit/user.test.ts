import { expect } from 'chai';
import { describe, before } from 'mocha';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

let newUser = {
  name: "Powell",
  emailId: "PaperBag@gmail.com",
  password: "Balance@bro"
};
let forgetToken = "";

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

  describe('Create User', () => {
    it('should create a new user and return 201 status with success message', (done) => {
      request(app.getApp())
        .post('/api/v1/admin/signup')
        .send(newUser)
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

  describe("Login User", () => {
    it('should log in the user created above and return the 200 status with a token', (done) => {
        const LoginDetails = {
          emailId: newUser.emailId,
          password: newUser.password
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
          done();
        })
      });

  });

  describe('Forget Password', () => {
    it("should generate the reset token to reset the password", (done) => {
      const forgetDetails = {
        emailId: newUser.emailId
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

  describe("Reset Password", () => {
    it("should reset the password successfully", (done) => {
      const resetPasswordDetails = {
        token: forgetToken,
        newPassword: '1234762@pass'
      };
      request(app.getApp())
        .post('/api/v1/admin/resetpassword')
        .set('Authorization', `Bearer ${forgetToken}`)
        .send(resetPasswordDetails)
        .expect(200)
        .end((err, res) => {
          if(err){
            console.error(err.message);
            return done(err);
          };
          expect(res.body).to.have.property("message").that.equals("Password changed successfully");
        })
    })
  })


  });
