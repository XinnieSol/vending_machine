import { Router } from "express";
import productController from "src/controllers/product.controller";
import { BuyProductProductDTO } from "src/dto/buy-product.dto";
import { CreateProductDTO } from "src/dto/create-product.dto";
import { UpdateProductDTO } from "src/dto/update-product.dto";
import { authenticate, authorizeBuyer, authorizeProductSeller, authorizeSeller } from "src/middlewares/auth.middleware";
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

    router.put(
        "/:productId",
        authenticate,
        authorizeProductSeller,
        validator(UpdateProductDTO, "body"),
        productController.updateProduct
    );

    router.delete(
        "/:productId",
        authenticate,
        authorizeProductSeller,
        productController.deleteProduct
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