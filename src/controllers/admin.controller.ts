/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import adminService from '../services/admin.service';

import { Request, Response, NextFunction } from 'express';

class AdminController {
  public AdminService = new adminService();

  /**
   * Controller to create new user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.AdminService.signUp(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'User created successfully'
      });
    } catch (error) {
      error.code === 11000
        ? res.status(HttpStatus.CONFLICT).json({
            code: HttpStatus.CONFLICT,
            data: '',
            message: 'EmailId already present'
          })
        : next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.AdminService.login(
        req.body.emailId,
        req.body.password
      );
      if (data === null) {
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          data: data,
          message: 'EmailId not found'
        });
      } else if (data === false) {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          data: data,
          message: 'Password mismatched'
        });
      } else {
        const {name, emailId} = data;
        res.cookie('accessToken', data.accessToken, {httpOnly: true, secure: false, sameSite: "strict"});
        res.cookie('refreshToken', data.refreshToken, {httpOnly: true, secure: false, sameSite: "strict"});
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: {name, emailId},
          message: 'Login Successfull'
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public glogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.AdminService.glogin(req.body.emailId);
      if (data) {
        const {name, emailId} = data
        res.cookie('accessToken', data?.accessToken, { httpOnly: true, secure: false, sameSite: "strict" });
        res.cookie('refreshToken', data?.refreshToken, { httpOnly: true, secure: false, sameSite: "strict" });
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: {name, emailId},
          message: "Login successfully"
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          data: data,
          message: "EmailId not found"
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public tokenCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.AdminService.tokenCheck(
        req.cookies.accessToken, 
        req.cookies.refreshToken
      );
      
      data.newAccessToken ?  res.cookie('accessToken', data.newAccessToken, {httpOnly: true, secure: false, sameSite: "strict"}):
      null; 
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: true,
        message: "Token verified successfully"
      })
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to update a user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public forgetpassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.AdminService.forgetpassword(req.body.emailId);
      if (data === null) {
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          data: data,
          message: 'EmailId not found'
        });
      } else {
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: data,
          message: 'Mail sent'
        });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to delete a single user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public resetpassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.AdminService.resetpassword(req.params.id, req.body.password);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: {},
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public getadmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.AdminService.getadmin(req.body.userId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'User fetched'
      });
    } catch (error) {
      next(error);
    }
  };

  public editadmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.AdminService.editadmin(req.body, req.body.userId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Admin updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;
