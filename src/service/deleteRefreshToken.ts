import { createHash } from "crypto";
import RefreshToken from "../models/refreshToken";

const deleteRefreshToken = async (token: string) => {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await RefreshToken.updateOne({ tokenHash }, { revoked: true });
    return;
};

export default deleteRefreshToken;
