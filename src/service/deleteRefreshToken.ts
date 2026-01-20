import RefreshToken from "../models/refreshToken";
import hash from "../utils/hash";

const deleteRefreshToken = async (token: string) => {
    const tokenHash = hash(token);
    await RefreshToken.updateOne({ tokenHash }, { revoked: true });
    return;
};

export default deleteRefreshToken;
