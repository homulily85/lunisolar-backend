import { type EventInput, TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import { addNewEvent } from "../../services/eventService";
import { scheduleNotificationForUser } from "../../services/notificationService";

const addEvent = async (
    _root: unknown,
    { newEvent }: { newEvent: EventInput },
    { tokenPayload }: { tokenPayload: TokenPayload },
) => {
    if (!tokenPayload) {
        throw new GraphQLError("invalid credentials", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }

    const createdEvent = await addNewEvent(newEvent, tokenPayload.id);
    await scheduleNotificationForUser(tokenPayload.id, createdEvent.toObject());
    return createdEvent;
};
export default addEvent;
