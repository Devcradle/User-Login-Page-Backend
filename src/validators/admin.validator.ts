import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class AdminValidator {
  public signup = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      name: Joi.string().min(4).required(),
      emailId: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };

  public login = (req: Request, res: Response, next: NextFunction): void =>{
    const schema = Joi.object({
      emailId: Joi.string().email().required(),
      password: Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
      next(error);
    }
    next();
  };

  public forgetpassword = (req: Request, res: Response, next: NextFunction): void =>{
    const schema = Joi.object({
      emailId: Joi.string().email().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        next(error);
    }
    next();
  };

  public resetpassword = (req: Request, res: Response, next: NextFunction): void =>{
    const schema = Joi.object({
      password: Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
      next(error);
    }
    next();
  };

  public validateId = (req: Request, res: Response, next: NextFunction): void =>{
    const schema = Joi.object({
      userId: Joi.string()
    });
    const {error} = schema.validate(req.body);
    if(error){
      next(error);
    }
    next();
  };

  public editadmin = (req: Request, res: Response, next: NextFunction): void =>{
    const schema = Joi.object({
      userId: Joi.string(),
      name: Joi.string().min(4).required(),
      emailId: Joi.string().email().required(),
    });
    const {error} = schema.validate(req.body);
    if(error){
      next(error);
    }
    next();
  };

}

export default AdminValidator;
