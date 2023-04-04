import UserService from "src/services/user.service";
import { Request } from "express";
import { appResponse } from "src/helpers/app-response.helper";
import { AuthRequest, User } from "src/interfaces/user.interface";

class UserController {
    async register(req: Request, res: Request) {
        try {
            const result = await UserService.register(req.body);
            return appResponse(res, 201, "Registration successful", result);
        } catch (error) {
            console.log(error);
            appResponse(res, 500, "Internal server error");
        }
    }

    async login(req: Request, res: Request) {
        try {
            const result = await UserService.loginUser(req.body);
            return appResponse(res, 201, "Login successful", result);
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }

    async deposit(req: Request & AuthRequest, res: Request) {
        try {
            const { _id } = req.user;
            const result = await UserService.deposit(_id, req.body);
            return appResponse(res, 201, "deposit successful", result);
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }
}

export default new UserController();