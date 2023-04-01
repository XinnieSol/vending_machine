import { Types } from "mongoose";

export interface ProductDocument {
    userId: Types.ObjectId;
    name: string;
    description: string;
    price: number;
}