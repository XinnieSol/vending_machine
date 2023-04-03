import express from 'express';
import { userRouter } from './user.route';

const router = express.Router();

export default function() {
    router.use("/users", userRouter());
    
    return router;
}