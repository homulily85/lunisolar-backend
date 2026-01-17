import * as mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const connectToDatabase = async (uri: string | undefined) => {
    if (!uri) {
        console.log("Cannot find MONGO_URI in process's environment.");
        process.exit(1);
    }
    console.log("connecting to database URI:", uri);
    try {
        await mongoose.connect(uri);
        console.log("connected to MongoDB");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error connection to MongoDB:", error.message);
        }
        process.exit(1);
    }
};
