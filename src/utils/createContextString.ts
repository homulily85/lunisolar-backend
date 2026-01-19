import { randomBytes } from "crypto";

const creteContextString = (length = 32): string => {
    const bytes = Math.ceil(length / 2);
    return randomBytes(bytes).toString("hex").slice(0, length);
};

export default creteContextString;
