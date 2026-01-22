import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";
import { TokenPayload } from "../../type";
import isValidContextString from "./isValidContextString";
import { GraphQLError } from "graphql/error";

const getAccessTokenPayload = (
    accessToken: string | undefined,
    contextString: string | undefined,
) => {
    try {
        if (!accessToken || !contextString) {
            return null;
        }
        const decodedToken = jwt.verify(
            accessToken,
            ACCESS_TOKEN_SECRET,
        ) as TokenPayload;
        if (
            !isValidContextString(
                contextString,
                decodedToken?.hashedContextString,
            )
        ) {
            return null;
        }
        return decodedToken;
    } catch (e) {
        if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
            throw new GraphQLError("invalid credentials", {
                extensions: {
                    code: "UNAUTHENTICATED",
                },
            });
        } else {
            console.log(e);
            throw new GraphQLError("something went wrong", {
                extensions: {
                    code: "INTERNAL_SERVER_ERROR",
                },
            });
        }
    }
};

export default getAccessTokenPayload;
