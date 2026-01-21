import hash from "../hash";

const isValidContextString = (
    contextString: string,
    hashedContextString: string,
) => {
    return hashedContextString === hash(contextString);
};

export default isValidContextString;
