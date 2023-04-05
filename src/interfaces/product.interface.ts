import { Types } from "mongoose";

export interface ProductDocument {
    sellerId: Types.ObjectId;
    name: string;
    description: string;
    price: number;
}