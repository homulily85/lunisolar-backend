import { EventInput, TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import { updateAnEvent } from "../../services/eventService";

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

    return await updateAnEvent(eventToBeUpdated, tokenPayload.id);
};

export default updateEvent;
