import { Router } from "express";
import productController from "src/controllers/product.controller";
import { BuyProductProductDTO } from "src/dto/buy-product.dto";
import { CreateProductDTO } from "src/dto/create-product.dto";
import { authenticate, authorizeBuyer, authorizeSeller } from "src/middlewares/auth.middleware";
import { validator } from "src/validators";

const router = Router();

export function ProductRouter() {
    router.post(
        "/",
        authenticate,
        authorizeSeller,
        validator(CreateProductDTO, "body"),
        productController.createProduct
    );

    router.get(
        "/:productId",
        authenticate,
        productController.productDetails
    );

    router.get(
        "/",
        authenticate,
        productController.fetchProducts
    );

    router.post(
        "/:productId/buy",
        authenticate,
        authorizeBuyer,
        validator(BuyProductProductDTO, "body"),
        productController.buyProduct
    );

    return router;
}