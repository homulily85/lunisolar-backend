import auth from "./mutations/auth";
import logout from "./mutations/logout";
import refreshAccessToken from "./mutations/refreshAccessToken";
import addEvent from "./mutations/addEvent";
import getEvents from "./query/getEvents";
import deleteEvent from "./mutations/deleteEvent";

const resolvers = {
    Query: { getEvents },
    Mutation: {
        auth,
        refreshAccessToken,
        logout,
        addEvent,
        deleteEvent,
    },
};

export default resolvers;
