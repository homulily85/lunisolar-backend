import dotenv from "dotenv";
import { ServiceAccount } from "firebase-admin";

dotenv.config();

if (!process.env.PORT) {
    throw new Error("PORT is not defined in environment variables.");
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}

if (!process.env.OAUTH_CLIENT_ID) {
    throw new Error("OAUTH_CLIENT_ID is not defined in environment variables.");
}

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables.",
    );
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error(
        "REFRESH_TOKEN_SECRET is not defined in environment variables.",
    );
}

if (!process.env.ACCESS_TOKEN_LIFETIME) {
    throw new Error(
        "ACCESS_TOKEN_LIFETIME is not defined in environment variables.",
    );
}

if (!process.env.REFRESH_TOKEN_LIFETIME) {
    throw new Error(
        "REFRESH_TOKEN_LIFETIME is not defined in environment variables.",
    );
}

if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST is not defined in environment variables.");
}

if (!process.env.REDIS_PORT) {
    throw new Error("REDIS_PORT is not defined in environment variables.");
}

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY is not defined in environment variables.",
    );
}
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME;
export const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const FIREBASE_SERVICE_ACCOUNT_KEY = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
) as ServiceAccount;
