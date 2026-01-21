import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../../utils/config";
import isValidContextString from "../../utils/authentication/isValidContextString";
import { deleteRefreshToken } from "../../services/authenticationService";
import { TokenPayload } from "../../type";

const logout = async (
    _root: unknown,
    _args: unknown,
    context: { req: Request; res: Response },
) => {
    const refreshToken = context.req.cookies["refreshToken"] as string;

    if (!refreshToken) {
        return "success";
    }

    const payload = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
    ) as TokenPayload;

    const cookieContextString = context.req.cookies["refreshContext"] as string;

    if (
        !cookieContextString ||
        !isValidContextString(cookieContextString, payload.hashedContextString)
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

    return "success";
};

export default logout;
