import jwt from "jsonwebtoken";
import hash from "../hash";

const createToken = (
    {
        id,
        name,
        profilePictureLink,
    }: {
        id: string;
        name: string;
        profilePictureLink: string;
    },
    contextString: string,
    secret: string,
    expiresIn: jwt.SignOptions["expiresIn"],
) => {
    return jwt.sign(
        {
            id,
            name,
            profilePictureLink,
            hashedContextString: hash(contextString),
        },
        secret as jwt.Secret,
        {
            expiresIn,
        },
    );
};

export default createToken;
