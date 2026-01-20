import { Request } from "express";
import { EventSchema, TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import Event from "../../models/event";

const addEvent = async (
    _root: unknown,
    _args: unknown,
    context: { req: Request; tokenPayload: TokenPayload },
) => {
    if (!context.tokenPayload) {
        throw new GraphQLError("invalid credentials", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }

    const inputEvent = EventSchema.safeParse(context.req);
    if (!inputEvent.success) {
        throw new GraphQLError(`Invalid input ${inputEvent.error}`, {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }

    const createdEvent = new Event({
        ...inputEvent.data,
        startDateTime: new Date(inputEvent.data.startDateTime),
        endDateTime: new Date(inputEvent.data.endDateTime),
    });

    await createdEvent.save();
    return createdEvent;
};
export default addEvent;
