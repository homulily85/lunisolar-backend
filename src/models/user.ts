import mongoose from "mongoose";
import { User } from "../type";

const schema = new mongoose.Schema<User>({
    userId: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },
    name: {
        type: String,
    },
    profilePictureLink: {
        type: String,
    },
});

export default mongoose.model<User>("User", schema);
