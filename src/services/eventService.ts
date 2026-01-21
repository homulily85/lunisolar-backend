import { EventInput, EventSchema } from "../type";
import Event from "../models/event";
import { GraphQLError } from "graphql/error";

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
        user: userId,
        startDateTime: startDateTime,
        endDateTime: startDateTime,
    });

    await eventTobeAdded.save();
    return eventTobeAdded;
};
