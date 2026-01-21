import { Request, Response } from "express";
import InvalidCredentialError from "../../utils/authentication/InvalidCredentialError";
import jwt from "jsonwebtoken";
import {
    ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_SECRET,
} from "../../utils/config";
import { parseDurationToMiliseconds } from "../../utils/parseDurationToMiliseconds";
import { GraphQLError } from "graphql/error";
import isValidContextString from "../../utils/authentication/isValidContextString";
import { getAccessToken } from "../../service/authenticationService";
import { TokenPayload } from "../../type";

const refreshAccessToken = async (
    _root: unknown,
    _args: unknown,
    context: { req: Request; res: Response },
) => {
    try {
        const refreshToken = context.req.cookies["refreshToken"] as string;
        if (!refreshToken) {
            throw new InvalidCredentialError();
        }

        const payload = jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET,
        ) as TokenPayload;

        const cookieContextString = context.req.cookies[
            "refreshContext"
        ] as string;

        if (
            !cookieContextString ||
            !isValidContextString(
                cookieContextString,
                payload.hashedContextString,
            )
        ) {
            throw new InvalidCredentialError();
        }

        const { accessToken, contextString } =
            await getAccessToken(refreshToken);
        const cookieLifeTime = parseDurationToMiliseconds(
            ACCESS_TOKEN_LIFETIME,
        );

        context.res.cookie("accessContext", contextString, {
            httpOnly: true,
            maxAge: cookieLifeTime,
            sameSite: "strict",
            secure: true,
        });

        return accessToken;
    } catch (e) {
        if (e instanceof InvalidCredentialError) {
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

export default refreshAccessToken;
