import { NextFunction } from "express";
import { Model, model, Schema } from "mongoose";
import { UserDocument } from "src/interfaces/user.interface";
import { hashPassword } from "src/utils/auth.util";


const UserSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            lowercase: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['buyer', 'seller'],
            required: true
        },
        coins: {
            type: Array,
            default: []
        },
        sessions: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

UserSchema.pre<UserDocument & Schema>("save",
    async function (next: NextFunction) {
        const user = this;
        if (user.isModified("password") || this.isNew) {
            user.password = await hashPassword(user.password);
        }
        next();

    }
);

UserSchema.set("toJSON", {
    versionKey: false,
    transform(doc, ret) {
        delete ret.password;
    }
});

const UserModel: Model<UserDocument> = model("user", UserSchema);

export default UserModel;