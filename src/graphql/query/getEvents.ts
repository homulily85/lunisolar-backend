import { TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import { getEventsInTimeRange } from "../../services/eventService";

const getEvents = (
    _root: unknown,
    { rangeStart, rangeEnd }: { rangeStart: string; rangeEnd: string },
    { tokenPayload }: { tokenPayload: TokenPayload },
) => {
    if (!tokenPayload) {
        throw new GraphQLError("invalid credentials", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }

    return getEventsInTimeRange(tokenPayload.id, rangeStart, rangeEnd);
};

export default getEvents;
