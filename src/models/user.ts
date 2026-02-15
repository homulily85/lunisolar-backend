import mongoose from "mongoose";
import { IUser } from "../type";

const schema = new mongoose.Schema<IUser>(
    {
        googleId: {
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
        fcmTokens: {
            type: [String],
            default: [],
        },
    },
    {
        toJSON: {
            transform(doc, ret: Record<string, unknown>) {
                delete ret["__v"];
                delete ret["_id"];
                delete ret["googleId"];
                // Use internal id for better event and token management.
                ret["id"] = doc._id.toString();
                delete ret["fcmTokens"];
                return ret;
            },
        },
        timestamps: true,
    },
);

export default mongoose.model<IUser>("User", schema);
