import { Schema, Document, Types, ObjectId } from "mongoose";


export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    coins: Array<number | void>
    sessions: Array<string | void>

}

export interface User extends Document {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    role: string;
    coins: Array<number | void>
    sessions: Array<string | void>

}

export interface AuthRequest extends Request{
    user: User 

}