import { TokenPayload } from "../../type";
import { GraphQLError } from "graphql/error";
import { addFCMTokenToUser } from "../../services/notificationService";

const addFCMToken = async (
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
    await addFCMTokenToUser(tokenPayload.id, token);
    return "success";
};
export default addFCMToken;
