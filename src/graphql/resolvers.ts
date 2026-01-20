import getRefreshToken from "../service/getRefreshToken";
import { GraphQLError } from "graphql/error";
import { Request, Response } from "express";
import {
    ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_LIFETIME,
    REFRESH_TOKEN_SECRET,
} from "../utils/config";
import { parseDurationToMiliseconds } from "../utils/parseDurationToMiliseconds";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import getAccessToken from "../service/getAccessToken";
import InvalidCredentialError from "../utils/InvalidCredentialError";
import deleteRefreshToken from "../service/deleteRefreshToken";

const resolvers = {
    Query: {},
    Mutation: {
        auth: async (
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
        },
        refreshAccessToken: async (
            _root: unknown,
            _args: unknown,
            context: { req: Request; res: Response },
        ) => {
            try {
                const refreshToken = context.req.cookies[
                    "refreshToken"
                ] as string;
                if (!refreshToken) {
                    throw new InvalidCredentialError();
                }

                const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

                if (
                    typeof payload === "object" &&
                    payload !== null &&
                    "contextString" in payload
                ) {
                    const cookieContextString = context.req.cookies[
                        "refreshContext"
                    ] as string;

                    if (
                        !cookieContextString ||
                        payload.contextString !==
                            createHash("sha256")
                                .update(cookieContextString)
                                .digest("hex")
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
                } else {
                    throw new InvalidCredentialError();
                }
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
        },
        logout: async (
            _root: unknown,
            _args: unknown,
            context: { req: Request; res: Response },
        ) => {
            const refreshToken = context.req.cookies["refreshToken"] as string;

            if (!refreshToken) {
                return "success";
            }

            const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            if (
                typeof payload === "object" &&
                payload !== null &&
                "contextString" in payload
            ) {
                const cookieContextString = context.req.cookies[
                    "refreshContext"
                ] as string;

                if (
                    !cookieContextString ||
                    payload.contextString !==
                        createHash("sha256")
                            .update(cookieContextString)
                            .digest("hex")
                ) {
                    return "success";
                }

                context.res.clearCookie("refreshContext", {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                });

                context.res.clearCookie("refreshToken", {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                });

                context.res.clearCookie("accessContext", {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true,
                });

                await deleteRefreshToken(refreshToken);
            }
            return "success";
        },
    },
};

export default resolvers;
