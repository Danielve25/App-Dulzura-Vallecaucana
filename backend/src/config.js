import dotenv from "dotenv";
dotenv.config();
export const TOKEN_SECRET = process.env.SECRET_KEY;
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
