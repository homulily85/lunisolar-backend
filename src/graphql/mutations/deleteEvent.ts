import { TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import { removeEvent } from "../../services/eventService";
import { cancelNotificationForEvent } from "../../services/notificationService";

const deleteEvent = async (
    _root: unknown,
    { eventId }: { eventId: string },
    { tokenPayload }: { tokenPayload: TokenPayload },
) => {
    if (!tokenPayload) {
        throw new GraphQLError("invalid credentials", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }

    await removeEvent(eventId, tokenPayload.id);
    await cancelNotificationForEvent(eventId);

    return "success";
};
export default deleteEvent;
