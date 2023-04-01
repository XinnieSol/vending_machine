import * as dotenv from 'dotenv';

dotenv.config();

export const database = {
    DATABASE_URI: process.env.DB_URI
}

export const appCredentials = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET
}