import mongoose from "mongoose";
import { EventDb } from "../type";

const schema = new mongoose.Schema<EventDb>({
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
});

export default mongoose.model<EventDb>("Event", schema);
