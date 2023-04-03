import UserService from "src/services/user.service";
import { Request } from "express";
import { appResponse } from "src/helpers/app-response.helper";

class UserController {
    async register(req: Request, res: Request) {
        try {
            console.log("God will provide money for me today April 3, 2023 in Jesus Name. Amen.")
            const result = await UserService.register(req.body);
            return appResponse(res, 201, "Registration successful", result);
        } catch (error) {
            console.log("God will provide money for me today April 3, 2023 in Jesus Name. Amen.")
            appResponse(res, 500, "Internal server error");
        }
    }
}

export default new UserController();