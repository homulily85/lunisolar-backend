import admin from "firebase-admin";
import { FIREBASE_SERVICE_ACCOUNT_KEY } from "./config";

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT_KEY),
        });
        console.log("Firebase Admin initialized successfully.");
    }
} catch (error) {
    console.error("Error initializing Firebase Admin:", error);
}
export default admin;
