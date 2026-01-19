import RefreshToken from "../models/refreshToken";
import { createHash } from "crypto";
import createContextString from "../utils/createContextString";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_SECRET } from "../utils/config";
import { UserDocument } from "../type";
import InvalidCredentialError from "../utils/InvalidCredentialError";

const getAccessToken = async (refreshToken: string) => {
    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

    const refreshTokenInfo = await RefreshToken.findOne({
        tokenHash,
    }).populate<{ user: UserDocument }>("user");
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
