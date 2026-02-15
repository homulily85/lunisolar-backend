import { removeFCMTokenFromUser } from "../../services/notificationService";
import { GraphQLError } from "graphql/error";
import { TokenPayload } from "../../type";

const removeFCMToken = async (
    _root: unknown,
    { token }: { token: string },
    { tokenPayload }: { tokenPayload: TokenPayload },
) => {
    if (!tokenPayload) {
        throw new GraphQLError("invalid credentials", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }
    await removeFCMTokenFromUser(tokenPayload.id, token);
    return "success";
};
export default removeFCMToken;
