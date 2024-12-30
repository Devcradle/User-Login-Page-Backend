import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { Request, Response, NextFunction } from 'express';

class UserController {
    public UserService = new userService();

    /**
     * @param {object} Request - request object 
     * @param {object} Response - response object
     * @param {Function} NextFunction
     */
    public newUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<any> => {
        try {
            const userData = req.body;
            if(req.file){
              const imageBaseUrl = 'http://localhost:3000/uploads/';
              userData.image = { path: `${imageBaseUrl}${req.file.filename}`};
            };
            const data = await this.UserService.newUser(req.body);
            res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                data: data,
                message: "User created successfully"
            });
        }catch(error){
            next(error);
        }
    };

     /**
   * Controller to update a user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public editUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.UserService.editUser(req.body, req.body.id);
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: data,
          message: 'User updated'
        });
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
     public getUsers = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<any> => {
      try {
        const data = await this.UserService.getUsers(req.body.userId);
          res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: data,
            message: 'Users fetched'
          });
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
   public getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.UserService.getUser(req.params.id);
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: data,
          message: 'Users fetched'
        });
    } catch (error) {
      next(error);
    }
  };

  

}

export default UserController;