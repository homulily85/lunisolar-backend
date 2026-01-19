import mongoose from "mongoose";
import { UserDocument } from "../type";

const schema = new mongoose.Schema<UserDocument>({
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

export default mongoose.model<UserDocument>("User", schema);
