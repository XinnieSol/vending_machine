import UserService from "src/services/user.service";
import { Request, Response } from "express";
import { appResponse } from "src/helpers/app-response.helper";
import { AuthRequest, User } from "src/interfaces/user.interface";

class UserController {
    async register(req: Request, res: Response) {
        try {
            const result = await UserService.register(req.body);
            return appResponse(res, 201, "Registration successful", result);
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }

    async login(req: Request, res: Response) {
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

    async logoutSessions(req: Request & AuthRequest, res: Response) {
        try {
            const userId = req.user._id;
            await UserService.logoutSession(userId);
            return appResponse(res, 201, "Logged out from all sessions successfully");
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }

    async deposit(req: Request & AuthRequest, res: Response) {
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

    async resetBalance(req: Request & AuthRequest, res: Response) {
        try {
            const { _id } = req.user;
            const result = await UserService.resetBalance(_id);
            return appResponse(res, 201, "Account balance reset successful", result);
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