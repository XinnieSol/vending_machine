import { model, Model, Schema, Types } from "mongoose";
import { ProductDocument } from "src/interfaces/product.interface";

const ProductSchema = new Schema<ProductDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
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