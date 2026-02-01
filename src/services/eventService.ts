import { EventInput, EventSchema } from "../type";
import Event from "../models/event";
import { GraphQLError } from "graphql/error";
import mongoose from "mongoose";
import { rrulestr } from "rrule";

/**
 * Get events happening in a time range for a specific user.
 * @param userId ID of the user to get events for.
 * @param rangeStart start of the time range, in ISO 8601 format.
 * @param rangeEnd end of the time range, in ISO 8601 format.
 * @returns Promise resolving to an array of events.
 */
export const getEventsInTimeRange = async (
    userId: string,
    rangeStart: string,
    rangeEnd: string,
) => {
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);

    const events = await Event.find({
        user: new mongoose.Types.ObjectId(userId),
        $or: [
            {
                $or: [{ rruleString: { $exists: false } }, { rruleString: "" }],
                startDateTime: { $lte: end },
                endDateTime: { $gte: start },
            },
            {
                rruleString: { $exists: true, $ne: "" },
                startDateTime: { $lte: end },
            },
        ],
    });

    return events.filter((e) => {
        if (!e.rruleString) {
            return true;
        } else {
            const rule = rrulestr(e.rruleString, { dtstart: e.startDateTime });
            const nextOccurrence = rule.after(start, true);
            return nextOccurrence && nextOccurrence <= end;
        }
    });
};

export const addNewEvent = async (event: EventInput, userId: string) => {
    const inputEvent = EventSchema.safeParse(event);
    if (!inputEvent.success) {
        throw new GraphQLError(`Invalid input ${inputEvent.error}`, {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }

    const startDateTime = new Date(inputEvent.data.startDateTime);
    const endDateTime = new Date(inputEvent.data.endDateTime);

    if (startDateTime > endDateTime) {
        throw new GraphQLError(
            `Start datetime must not be greater than end datetime `,
            {
                extensions: {
                    code: "BAD_USER_INPUT",
                },
            },
        );
    }
    const eventTobeAdded = new Event({
        ...inputEvent.data,
        user: new mongoose.Types.ObjectId(userId),
        startDateTime,
        endDateTime,
    });

    await eventTobeAdded.save();
    return eventTobeAdded;
};

export const removeEvent = async (eventId: string, userId: string) => {
    return Event.findOneAndDelete({
        _id: eventId,
        user: userId,
    });
};
