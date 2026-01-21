import { parseDurationToMiliseconds } from "../../utils/parseDurationToMiliseconds";
import { REFRESH_TOKEN_LIFETIME } from "../../utils/config";
import InvalidCredentialError from "../../utils/InvalidCredentialError";
import { GraphQLError } from "graphql/error";
import { Request, Response } from "express";
import { getRefreshToken } from "../../service/authenticationService";

const auth = async (
    _root: unknown,
    { oauthToken }: { oauthToken: string },
    context: { req: Request; res: Response },
) => {
    try {
        const { refreshToken, contextString } =
            await getRefreshToken(oauthToken);
        const cookieLifeTime = parseDurationToMiliseconds(
            REFRESH_TOKEN_LIFETIME,
        );

        context.res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: cookieLifeTime,
            sameSite: "strict",
            secure: true,
        });

        context.res.cookie("refreshContext", contextString, {
            httpOnly: true,
            maxAge: cookieLifeTime,
            sameSite: "strict",
            secure: true,
        });

        return "success";
    } catch (e) {
        if (e instanceof InvalidCredentialError) {
            throw new GraphQLError("invalid credentials", {
                extensions: {
                    code: "BAD_USER_INPUT",
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

export default auth;
