import User from "../models/user";
import { GraphQLError } from "graphql/error";

export const addFCMTokenToUser = async (userId: string, token: string) => {
    if (!userId || !token) {
        throw new GraphQLError("User ID and token are required", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new GraphQLError("User not found", {
            extensions: {
                code: "NOT_FOUND",
            },
        });
    }

    if (!user.fcmTokens.includes(token)) {
        user.fcmTokens.push(token);
        await user.save();
    }
};

export const removeFCMTokenFromUser = async (userId: string, token: string) => {
    if (!userId || !token) {
        throw new GraphQLError("User ID and token are required", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new GraphQLError("User not found", {
            extensions: {
                code: "NOT_FOUND",
            },
        });
    }

    user.fcmTokens = user.fcmTokens.filter((t) => t !== token);
    await user.save();
};
