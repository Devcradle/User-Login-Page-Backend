import express, { IRouter } from 'express';
import adminController from '../controllers/admin.controller';
import adminValidator from '../validators/admin.validator';
import { userAuth } from '../middlewares/auth.middleware';
import HashingPassword from '../utils/hash.util';


class AdminRoutes {
  private AdminController = new adminController();
  private router = express.Router();
  private AdminValidator = new adminValidator();
  private HashingPassword = new HashingPassword();
  constructor() {
    this.routes();
  }

  private routes = () => {
    
    this.router.post(
      '/signup',
      this.AdminValidator.signup,
      this.HashingPassword.EncryptPassword(),
      this.AdminController.signUp
    );

    this.router.post(
      '/login',
      this.AdminValidator.login,
      this.AdminController.login
    );

    this.router.post(
      '/forgetpassword',
      this.AdminValidator.forgetpassword,
      this.AdminController.forgetpassword
    );

    this.router.put(
      '/resetpassword',
      this.AdminValidator.resetpassword,
      this.AdminController.resetpassword
    );

    this.router.get(
      '',
      userAuth,
      this.AdminValidator.validateId,
      this.AdminController.getadmin
    );

    this.router.put(
      "",
      userAuth,
      this.AdminValidator.editadmin,
      this.AdminController.editadmin
    )


  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default AdminRoutes;
