import { model, Model, Schema, Types } from "mongoose";
import { ProductDocument } from "src/interfaces/product.interface";

const ProductSchema = new Schema<ProductDocument>(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users"
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            default: "no description"
        }
    },
    { timestamps: true }
);

ProductSchema.set("toJSON", {
    versionKey: false,
    transform(doc, ret) {
    }
});

const ProductModel: Model<ProductDocument> = model("product", ProductSchema);

export default ProductModel;