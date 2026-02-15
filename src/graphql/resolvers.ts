import auth from "./mutations/auth";
import logout from "./mutations/logout";
import refreshAccessToken from "./mutations/refreshAccessToken";
import addEvent from "./mutations/addEvent";
import getEvents from "./query/getEvents";
import deleteEvent from "./mutations/deleteEvent";
import updateEvent from "./mutations/updateEvent";
import addFcmToken from "./mutations/addFCMToken";
import removeFcmToken from "./mutations/removeFCMToken";

const resolvers = {
    Query: { getEvents },
    Mutation: {
        auth,
        refreshAccessToken,
        logout,
        addEvent,
        deleteEvent,
        updateEvent,
        addFcmToken,
        removeFcmToken,
    },
};

export default resolvers;
