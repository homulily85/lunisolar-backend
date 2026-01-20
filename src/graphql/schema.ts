const typeDefs = /*GraphQL*/ `
    type Event {
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

    input EventInput {
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
        addEvent(newEvent:EventInput!): Event
    },
    type Query{
        getEvents(token: String!): Event
    }
`;

export default typeDefs;
