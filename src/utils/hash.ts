import { createHash } from "crypto";

const hash = (value: string) =>
    createHash("sha256").update(value).digest("hex");

export default hash;
