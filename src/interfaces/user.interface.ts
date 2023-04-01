import { Schema, Document } from "mongoose";


export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    coins: Array<number | void>
    sessions: Array<string | void>

}