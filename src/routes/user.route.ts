import { Router } from "express";
import userController from "src/controllers/user.controller";
import { DepositDTO } from "src/dto/deposit.dto";
import { LoginDto } from "src/dto/login.dto";
import { RegisterDto } from "src/dto/register.dto";
import { authenticate, authorizeBuyer } from "src/middlewares/auth.middleware";
import { validator } from "src/validators";

const router = Router();

export function userRouter() {
    router.post(
        "/register", 
        validator(RegisterDto, "body"),
        userController.register
    );

    router.post(
        "/login", 
        validator(LoginDto, "body"),
        userController.login
    );

    router.post(
        "/deposit", 
        authenticate,
        authorizeBuyer,
        validator(DepositDTO, "body"),
        userController.deposit
    );

    return router;
}