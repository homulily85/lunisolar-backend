import mongoose from "mongoose";
import { IRefreshToken } from "../type";

const schema = new mongoose.Schema<IRefreshToken>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tokenHash: {
        type: String,
        unique: true,
        index: true,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Number,
        required: true,
    },
});

export default mongoose.model<IRefreshToken>("RefreshToken", schema);
