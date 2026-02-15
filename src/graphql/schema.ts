const typeDefs = /*GraphQL*/ `
    type EventFromServer {
        id: String
        title: String!
        place: String
        isAllDay: Boolean
        startDateTime: Float!
        endDateTime: Float!
        rruleString: String
        description: String
        reminder: [String]
    }

    input EventFromClient {
        id: String
        title: String!
        place: String
        isAllDay: Boolean
        startDateTime: String!
        endDateTime: String!
        rruleString: String
        description: String
        reminder: [String]
    }
    type Mutation{
        auth(oauthToken: String!): String,
        refreshAccessToken: String,
        logout:String,
        addEvent(newEvent:EventFromClient!): EventFromServer,
        deleteEvent(eventId: String!): String,
        updateEvent(eventToBeUpdated:EventFromClient!): EventFromServer,
        addFcmToken(token: String!): String,
        removeFcmToken(token: String!): String
    },
    type Query{
        getEvents(rangeStart:String!,rangeEnd:String!): [EventFromServer]
    }
`;

export default typeDefs;
