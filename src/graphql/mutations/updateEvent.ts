import { EventInput, TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import { updateAnEvent } from "../../services/eventService";
import {
    cancelNotificationForEvent,
    scheduleNotificationForUser,
} from "../../services/notificationService";

const updateEvent = async (
    _root: unknown,
    { eventToBeUpdated }: { eventToBeUpdated: EventInput },
    { tokenPayload }: { tokenPayload: TokenPayload },
) => {
    if (!tokenPayload) {
        throw new GraphQLError("invalid credentials", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }

    const updatedEvent = await updateAnEvent(eventToBeUpdated, tokenPayload.id);
    await cancelNotificationForEvent(updatedEvent._id.toString());
    await scheduleNotificationForUser(tokenPayload.id, updatedEvent);
    return updatedEvent;
};

export default updateEvent;
