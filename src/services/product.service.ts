import { contains } from "class-validator";
import { ObjectId, Types } from "mongoose";
import { BuyProductProductDTO } from "src/dto/buy-product.dto";
import { CreateProductDTO } from "src/dto/create-product.dto";
import { QueryParamsDTO } from "src/dto/query-params.dto";
import { UpdateProductDTO } from "src/dto/update-product.dto";
import { BadRequestError, DuplicateError, NotFoundError } from "src/helpers/app-error.helper";
import ProductModel from "src/models/product.model";
import UserModel from "src/models/user.model";

class ProductService {
    async createProduct(sellerId: ObjectId, data: CreateProductDTO): Promise<any> {
        const { name } = data;
        const exisiting = await ProductModel.findOne({ sellerId, name });
        if (exisiting)
            throw new DuplicateError("Name already exist");

        const productData = { sellerId, ...data };
        return await ProductModel.create(productData);
    }

    async fetchProducts(queryParams: QueryParamsDTO): Promise<any> {
        let { search, pageNo, noOfProducts, sortBy, sortDirection } = queryParams;
        pageNo = pageNo ? Number(pageNo) : 1;
        noOfProducts = noOfProducts ? Number(noOfProducts) : 20;
        let fetchedProducts: any;
        let productCount: number;
        let availablePages: number;
        let totalProducts: number;

        let matchQuery: any = {};
        if (search) {
            matchQuery["$or"] = [
                { 
                    "name": { $regex: search}
                }, 
                { 
                    "sellerData.username": { $regex: search }
                } ,
            ]
        }

        const sort: any = {}
        if (sortBy === "name") {
            sort.name = sortDirection == "ascending" ? 1 : -1;
        } else if(sortBy === "price") {
            sort.price = sortDirection == "ascending" ? 1 : -1;
        } else if (sortBy === "date") {
            sort.createdAt = sortDirection == "ascending" ? 1 : -1;
        } else {
            sort.createdAt = -1;
        }

        fetchedProducts = ProductModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "sellerId",
                    as: "sellerData"
                }
            },
            { $unwind: "$sellerData" },
            {
                $match: {...matchQuery }
            },
            {
                $project: {
                    "sellerData.password": 0,
                    "sellerData.role": 0,
                    "sellerData.coins": 0,
                    "sellerData.createdAt": 0,
                    "sellerData.updatedAt": 0,
                    

                }
            }
        ]);
        const limitNo = pageNo * noOfProducts;
    
        const newFetchedProducts = await fetchedProducts
            .sort(sort)
            .limit(limitNo)
            .skip((pageNo - 1) * noOfProducts);
            productCount = newFetchedProducts.length;

        if(productCount > 0) {
        availablePages = Math.ceil(productCount / noOfProducts);
        } else {
        availablePages = 0;
        }
    
        totalProducts = fetchedProducts.length;
        fetchedProducts = newFetchedProducts;

        return {
          currentPage: pageNo,
          availablePages,
          totalProducts: productCount,
          fetchedProducts,
        };
    }

    async productDetails(productId: string | Types.ObjectId): Promise<any> {
        productId = new Types.ObjectId(productId);
        const result = await ProductModel.findById(productId);
        if (!result)
            throw new NotFoundError("Product does not exist");
        return result;
    }

    async updateProduct(
        productId: string | Types.ObjectId, 
        data: UpdateProductDTO
    ): Promise<any> {
        const product = ProductModel.findById(productId);
        if(!product)
            throw new NotFoundError("Product does not exist");
        const { name, price, description } = data;
        const dataToUpdate: any = {};
        name ? dataToUpdate.name = name  : null;
        price ? dataToUpdate.price = price  : null;
        description ? dataToUpdate.description = description  : null;
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, dataToUpdate);

        return updatedProduct;

    }

    async buyProduct(
        buyerId: ObjectId,
        productId:string | Types.ObjectId, 
        data: BuyProductProductDTO
    ): Promise<any> {
        const { amountOfProduct } = data;
        productId = new Types.ObjectId(productId);
        const product = await ProductModel.findById(productId);
        if (!product)
            throw new NotFoundError("Product does not exist");

        const buyer = await UserModel.findById(buyerId);
        if (!buyer)
            throw new NotFoundError("buyer does not exist");

        let balance = 
            buyer.coins.length > 0 
            ? Number(buyer.coins.reduce((a: number, b: number) => a + b, 0))
            : 0

        const amountToPay = product.price * amountOfProduct;

        if (balance < amountToPay)
            throw new BadRequestError("Insuffiecient coins");

        let coins = (buyer.coins).sort((a: number, b: number) => a - b);
        
        if (coins.includes(amountToPay)) {
            coins.splice(coins.indexOf(amountToPay), 1);
            await UserModel.findByIdAndUpdate(
                buyerId, { $set: { coins } }
            );

            return {
                totalSpent: amountToPay,
                product,
                change: coins
            }
        } else if(balance === amountToPay) {
            await UserModel.findByIdAndUpdate(
                buyerId, { $set: { coins: [] } }
            );

            return {
                totalSpent: amountToPay,
                product,
                change: []
            }
        } else {
            let coinAmount = 0
            for (let i = coins.length - 1; i >= 0; i--) {
                const coin = Number(coins[i]);
                if (coin < amountToPay) {
                    if (coinAmount < amountToPay) {
                        coinAmount += coin;
                        coins.splice(i, 1);
                    }
                    
                } else if (coin > amountToPay) {
                    coins.splice(i, 1);
                    coinAmount = coin - amountToPay;
                     
                    let totalChange = 0;
                    let change = [...coins]
                    while (totalChange < coinAmount) {
                        totalChange += 5;
                        change.push(5);
                    }
                    coins = change.sort((a: number, b: number) => a - b);
                    await UserModel.findByIdAndUpdate(
                        buyerId, { $set: { coins } }
                    );
                    return {
                        totalSpent: amountToPay,
                        product,
                        change: coins
                    }
                    
                }
                
            }
            await UserModel.findByIdAndUpdate(
                buyerId, { $set: { coins } }
            );
            return {
                totalSpent: amountToPay,
                product,
                change: coins
            }
        }
        
    }
}

export default new ProductService();