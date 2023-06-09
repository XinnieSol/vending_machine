import { NextFunction, Request, Response } from "express";
import { ForbiddenError, NotFoundError, UnAuthorizedError } from "src/helpers/app-error.helper";
import productService from "src/services/product.service";
import userService from "src/services/user.service";
import { decryptToken } from "src/utils/auth.util";


const getToken = (
    req: Request & any,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth = req.headers["authorization"];
        if (!auth)
            throw new UnAuthorizedError("Authrization token required");
        const token = auth.split(' ')[1];
        return token;
    } catch (error) {
        next(error);
    }
}

export const authenticate = async function (
    req: Request & any,
    res: Response,
    next: NextFunction
) {
    const token = getToken(req, res, next);
    if (!token) throw new UnAuthorizedError("Invalid token");
    if (typeof token !== "string")
        throw new UnAuthorizedError("Invalid token");
    try {
        const userId = decryptToken(token);
        const user = await userService.fetchUserById(userId);

        if (!user)
            throw new UnAuthorizedError("Invalid token");


        req.user = user;

        if (user) {
            req.role = user.role;
        }

        next();

    } catch (error: any) {
        next(error);
    }
};


export const authorizeSeller = async (
    req: Request & any,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth = req?.user;
        if (!auth._id)
            throw new UnAuthorizedError("Unauthorized access");

        const userDetails = await userService.fetchUserById(auth._id);
        if (!userDetails)
            throw new UnAuthorizedError("Unauthorized access");

        if (userDetails.role !== "seller")
            throw new ForbiddenError("Only sellers can perform this action");

        req.user.authorized = true;

        next();
    } catch (error) {
        next(error);
    }
}

export const authorizeBuyer = async (
    req: Request & any,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth = req?.user;
        if (!auth._id)
            throw new UnAuthorizedError("Unauthorized access");

        const userDetails = await userService.fetchUserById(auth._id);
        if (!userDetails)
            throw new UnAuthorizedError("Unauthorized access");

        if (userDetails.role !== "buyer")
            throw new ForbiddenError("Only buyers can perform this action");

        req.user.authorized = true;

        next();
    } catch (error) {
        next(error);
    }
}

export const authorizeProductSeller = async (
    req: Request & any,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth = req?.user;
        const productId = req.params.productId;
        if (!auth._id)
            throw new UnAuthorizedError("Unauthorized access");

        const userDetails = await userService.fetchUserById(auth._id);
        if (!userDetails)
            throw new UnAuthorizedError("Unauthorized access");

        const productDetails = await productService.productDetails(productId);
        if (!productDetails || productDetails.sellerId.toString() != auth._id.toString())
            throw new ForbiddenError("Only seller and creator of this product can perform this action");

        req.user.authorized = true;

        next();
    } catch (error) {
        next(error);
    }
}
