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
                    "sellerData.sesions": 0
                    

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

    async deleteProduct(productId: string | Types.ObjectId): Promise<any> {
        productId = new Types.ObjectId(productId);
        const product = await ProductModel.findById(productId);
        if (!product)
            throw new NotFoundError("Product does not exist");
        await ProductModel.findByIdAndDelete(productId);

        return;
    }

    async updateProduct(
        productId: string | Types.ObjectId, 
        data: UpdateProductDTO
    ): Promise<any> {
        const product = await ProductModel.findById(productId);
        if(!product)
            throw new NotFoundError("Product does not exist");
        const { name, price, description } = data;
        const dataToUpdate: any = {};
        name ? dataToUpdate.name = name  : null;
        price ? dataToUpdate.price = price  : null;
        description ? dataToUpdate.description = description  : null;

        if (dataToUpdate.name) {
            const exisiting = await ProductModel.findOne({ 
                sellerId: product.sellerId, name 
            });
            if (exisiting)
                throw new DuplicateError("Name already exist");
        }
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, dataToUpdate);

        return updatedProduct;

    }

    async buyProduct(
        buyerId: ObjectId,
        productId: string | Types.ObjectId, 
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

        let coins = buyer.coins;
        let balance = 
            coins.length
            ? Number(coins.reduce((a: number, b: number) => a + b, 0))
            : 0

        const amountToPay = product.price * amountOfProduct;

        if (balance < amountToPay)
            throw new BadRequestError("Insuffiecient coins");

        coins = coins.sort((a: number, b: number) => a - b);
        
        const change = await this.processBalance(balance, coins, amountToPay);
        await UserModel.findByIdAndUpdate(
            buyerId, { $set: { coins: change } }
        );
        // credit seller;
        
    }

    async processBalance(
        balance: number, coins: Array<number | void>, amountToPay: number
    ) {
        if(balance === amountToPay) return [];

        if (coins.includes(amountToPay)) {
            coins.splice(coins.indexOf(amountToPay), 1);

            return coins;
        } 

        let coinAmount = 0;
        for (let i = coins.length - 1; i >= 0; i--) {
            let coin = Number(coins[i]);

            if (coinAmount > amountToPay) {
                coinAmount = coinAmount - amountToPay;
                let totalChange = 0;
                let change = [...coins]
                let possibleChangeCoins = [100, 50, 20, 10, 5];
                for (let j = 0; j < possibleChangeCoins.length; j++) {
                    let possibleCoin = possibleChangeCoins[j];
                    while ((totalChange + possibleCoin) <= coinAmount) {
                        totalChange += possibleCoin;
                        change.push(possibleCoin);
                    }
                }
                coins = change.sort((a: number, b: number) => a - b);

                return  coins;
            }

            if (coin < amountToPay) {
                coinAmount += coin;
                coins.splice(i, 1);

            } else if (coin > amountToPay) {
                coins.splice(i, 1);
                coinAmount = coin - amountToPay;
                let totalChange = 0;
                let change = [...coins]
                let possibleChangeCoins = [100, 50, 20, 10, 5];
                for (let j = 0; j < possibleChangeCoins.length; j++) {
                    let coin = possibleChangeCoins[j];
                    while ((totalChange + coin) <= coinAmount) {
                        totalChange += coin;
                        change.push(coin);
                    }
                }
                coins = change.sort((a: number, b: number) => a - b);

                return coins;
                
            }
            
        }
    }

    async creditSeller(
        sellerId: Types.ObjectId, coins: Array<number | void>
    ): Promise<void> {
        await UserModel.findByIdAndUpdate(sellerId, {
            $push: {
                coins: { $each: coins }
            }
        });
    }
}

export default new ProductService();