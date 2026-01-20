import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/config";
import { TokenPayload } from "../type";
import isValidContextString from "../utils/isValidContextString";

const getAccessTokenPayload = (
    accessToken: string | undefined,
    contextString: string | undefined,
) => {
    if (!accessToken || !contextString) {
        return null;
    }
    const decodedToken = jwt.verify(
        accessToken,
        ACCESS_TOKEN_SECRET,
    ) as TokenPayload;
    if (!isValidContextString(contextString, decodedToken?.contextString)) {
        return null;
    }
    return decodedToken;
};

export default getAccessTokenPayload;
