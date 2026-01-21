import mongoose from "mongoose";
import { EventDb } from "../type";

const schema = new mongoose.Schema<EventDb>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        place: {
            type: String,
        },
        isAllDay: {
            type: Boolean,
            required: true,
            default: false,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
        rruleString: {
            type: String,
        },
        description: {
            type: String,
        },
        reminder: {
            type: [String],
        },
    },
    {
        toJSON: {
            transform(doc, ret: Record<string, unknown>) {
                ret["id"] = doc._id.toString();
                delete ret["_id"];
                delete ret["__v"];
                return ret;
            },
        },
        timestamps: true,
    },
);

export default mongoose.model<EventDb>("Event", schema);
