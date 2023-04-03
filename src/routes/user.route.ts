import { Router } from "express";
import userController from "src/controllers/user.controller";
import { RegisterDto } from "src/dto/register.dto";
import { validator } from "src/validators";

const router = Router();

export function userRouter() {
    router.post(
        "/register", 
        validator(RegisterDto, "body"),
        userController.register
    );

    return router;
}