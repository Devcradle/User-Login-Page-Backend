import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class UserValidator {
  public newUserValidate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const schema = Joi.object({
      name: Joi.string().min(4).required(),
      department: Joi.string().required(),
      designation: Joi.string().required(),
      userId: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };

  public editUserValidate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const schema = Joi.object({
      name: Joi.string(),
      department: Joi.string(),
      designation: Joi.string(),
      id: Joi.string(),
      userId: Joi.string()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };

  public validateId = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const schema = Joi.object({
      userId: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
}

export default UserValidator;
