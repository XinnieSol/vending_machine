import { Request, Response } from "express";
import { appResponse } from "src/helpers/app-response.helper";
import { AuthRequest } from "src/interfaces/user.interface";
import ProductService from "src/services/product.service";


class ProductController {
    async createProduct(req: Request & AuthRequest, res: Response): Promise<any> {
        try {
            const { _id } = req.user;
            const data = req.body;
            const result = await ProductService.createProduct(_id, data);
            return appResponse(res, 201, "Product created successfully", result);
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }

    async productDetails(req: Request, res: Response): Promise<any> {
        try {
            const data = req.body;
            const productId = req.params.productId;
            const result = await ProductService.productDetails(productId);
            return appResponse(res, 201, "Product details fetched successfully", result);
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }

    async fetchProducts(req: Request, res: Response): Promise<any> {
        try {
            const queryParams = req.query;
            const result = await ProductService.fetchProducts(queryParams);
            return appResponse(res, 201, "Products fetched successfully", result);
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }

    async buyProduct(req: Request & AuthRequest, res: Response): Promise<any> {
        try {
            const buyerId = req.user._id;
            const productId = req.params.productId;
            const result = await ProductService.buyProduct(buyerId, productId, req.body);
            return appResponse(res, 201, "Product bought successfully", result);
        } catch (error) {
            appResponse(
                res, 
                error.statusCode, 
                error.message ? error.message : "Internal server error"
            );
        }
    }
}

export default new ProductController();