import { type EventInput, TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import { addNewEvent } from "../../services/eventService";

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

    return await addNewEvent(newEvent, tokenPayload.id);
};
export default addEvent;
