import auth from "./mutations/auth";
import logout from "./mutations/logout";
import refreshAccessToken from "./mutations/refreshAccessToken";
import addEvent from "./mutations/addEvent";
import getEvents from "./query/getEvents";

const resolvers = {
    Query: { getEvents },
    Mutation: {
        auth,
        refreshAccessToken,
        logout,
        addEvent,
    },
};

export default resolvers;
