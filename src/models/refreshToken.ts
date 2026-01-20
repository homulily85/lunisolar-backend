import mongoose from "mongoose";
import { RefreshToken } from "../type";

const schema = new mongoose.Schema<RefreshToken>({
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

export default mongoose.model<RefreshToken>("RefreshToken", schema);
