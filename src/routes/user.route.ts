import express, { IRouter } from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';
import upload from '../middlewares/upload.middleware';
import { userAuth } from '../middlewares/auth.middleware';


class UserRoutes {
    private UserController = new UserController();
    private router = express.Router();
    private UserValidator = new UserValidator();
    constructor(){
        this.routes();
    }

    private routes = () =>{

        this.router.post(
            '/',
            upload.single('image'),
            userAuth,
            this.UserValidator.newUserValidate,
            this.UserController.newUser
        );

        this.router.put(
            '/',
            userAuth,
            this.UserValidator.editUserValidate,
            this.UserController.editUser
        );

        this.router.get(
            '/',
            userAuth,
            this.UserValidator.validateId,
            this.UserController.getUser
        );

        this.router.get(
            '/all',
            userAuth,
            this.UserValidator.validateId,
            this.UserController.getUsers
        );

        
    };

    public getRoutes  = (): IRouter =>{
        return this.router;
    };
}

export default UserRoutes;