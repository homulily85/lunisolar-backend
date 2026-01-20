import auth from "./mutations/auth";
import logout from "./mutations/logout";
import refreshAccessToken from "./mutations/refreshAccessToken";
import addEvent from "./mutations/addEvent";

const resolvers = {
    Query: {},
    Mutation: {
        auth,
        refreshAccessToken,
        logout,
        addEvent,
    },
};

export default resolvers;
