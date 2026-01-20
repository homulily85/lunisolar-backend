import RefreshToken from "../models/refreshToken";
import { createHash } from "crypto";
import createContextString from "../utils/createContextString";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_SECRET } from "../utils/config";
import { User } from "../type";
import InvalidCredentialError from "../utils/InvalidCredentialError";
import hash from "../utils/hash";

const getAccessToken = async (refreshToken: string) => {
    const tokenHash = hash(refreshToken);

    const refreshTokenInfo = await RefreshToken.findOne({
        tokenHash,
    }).populate<{ user: User }>("user");
    if (
        !refreshTokenInfo ||
        refreshTokenInfo.revoked ||
        refreshTokenInfo.expiresAt < Date.now().valueOf()
    ) {
        throw new InvalidCredentialError();
    }

    const contextString = createContextString();
    const userForToken = {
        userId: refreshTokenInfo.user.userId,
        name: refreshTokenInfo.user.name,
        profilePictureLink: refreshTokenInfo.user.profilePictureLink,
        contextString: createHash("sha256").update(contextString).digest("hex"),
    };

    const accessToken = jwt.sign(
        userForToken,
        REFRESH_TOKEN_SECRET as jwt.Secret,
        {
            expiresIn: ACCESS_TOKEN_LIFETIME as jwt.SignOptions["expiresIn"],
        },
    );

    return {
        contextString,
        accessToken,
    };
};

export default getAccessToken;
