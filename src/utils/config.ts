import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const MONGO_URI = process.env.MONGO_URI;
