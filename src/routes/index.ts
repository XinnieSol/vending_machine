import express from 'express';
import { ProductRouter } from './product.route';
import { userRouter } from './user.route';

const router = express.Router();

export default function() {
    router.use("/users", userRouter());
    router.use("/products", ProductRouter());
    
    return router;
}