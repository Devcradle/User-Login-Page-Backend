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
  ): Promise<any> => {
    try {
      const data = await this.AdminService.signUp(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'User created successfully'
      });
    } catch (error) {
      error.code === 11000?
      res.status(HttpStatus.CONFLICT).json({
        code: HttpStatus.CONFLICT,
        data: "",
        message: "EmailId already present",
      }):
      next(error);
    }
  };



  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.AdminService.login(req.body.emailId, req.body.password);
      if(data === null){
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          data: data,
          message: 'EmailId not found'
        });
      }else if(data === false){
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          data: data,
          message: "Password mismatched"
        });
      }else{
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: data,
          message: "Login Successfull"
        });
      }
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
  ): Promise<any> => {
    try {
      const data = await this.AdminService.forgetpassword(req.body.emailId);
      if(data === null){
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          data: data,
          message: 'EmailId not found'
        });
      }else{
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: data,
          message: 'Mail sent'
        })
      };
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
  ): Promise<any> => {
    try {
      const data = await this.AdminService.resetpassword(req.params._id, req.body.password);
      if(data){
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: {},
          message: 'Password changed successfully'
        });
      }else{
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          data: "",
          message: "Invalid link"
        })
      };
    } catch (error) {
      next(error);
    }
  };

  public getadmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
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
  ): Promise<any> => {
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