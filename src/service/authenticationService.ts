import hash from "../utils/hash";
import RefreshToken from "../models/refreshToken";
import { type IUser } from "../type";
import InvalidCredentialError from "../utils/InvalidCredentialError";
import createContextString from "../utils/createContextString";
import jwt from "jsonwebtoken";
import {
    ACCESS_TOKEN_LIFETIME,
    OAUTH_CLIENT_ID,
    REFRESH_TOKEN_LIFETIME,
    REFRESH_TOKEN_SECRET,
} from "../utils/config";
import { OAuth2Client } from "google-auth-library";
import { parseDurationToMiliseconds } from "../utils/parseDurationToMiliseconds";
import User from "../models/user";

export const getAccessToken = async (refreshToken: string) => {
    const tokenHash = hash(refreshToken);

    const refreshTokenInfo = await RefreshToken.findOne({
        tokenHash,
    }).populate<{ user: IUser }>("user");
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
        contextString: hash(contextString),
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

export const getRefreshToken = async (token: string) => {
    const client = new OAuth2Client(OAUTH_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        throw new InvalidCredentialError();
    }

    const contextString = createContextString();

    let user = await User.findOne({ userId: payload.sub });
    if (!user) {
        user = new User({
            userId: payload.sub,
            name: payload.name,
            profilePictureLink: payload.picture,
        });

        await user.save();
    }

    const userForToken = {
        userId: payload.sub,
        name: payload.name,
        profilePictureLink: payload.picture,
        contextString: hash(contextString),
    };

    const refreshToken = jwt.sign(
        userForToken,
        REFRESH_TOKEN_SECRET as jwt.Secret,
        {
            expiresIn: REFRESH_TOKEN_LIFETIME as jwt.SignOptions["expiresIn"],
        },
    );

    await new RefreshToken({
        user: user._id,
        tokenHash: hash(refreshToken),
        revoked: false,
        expiresAt: new Date(
            Date.now() +
                parseDurationToMiliseconds(REFRESH_TOKEN_LIFETIME).valueOf(),
        ),
    }).save();

    return {
        contextString: contextString,
        refreshToken: refreshToken,
    };
};

export const deleteRefreshToken = async (token: string) => {
    const tokenHash = hash(token);
    await RefreshToken.updateOne({ tokenHash }, { revoked: true });
    return;
};
