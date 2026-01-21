import mongoose from "mongoose";
import { IUser } from "../type";

const schema = new mongoose.Schema<IUser>({
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

export default mongoose.model<IUser>("User", schema);
