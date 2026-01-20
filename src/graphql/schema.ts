const typeDefs = /*GraphQL*/ `
    type User {
        name: String,
        id: ID,
        profilePictureLink: String
    },
    type Mutation{
        auth(oauthToken: String!): String,
        refreshAccessToken: String,
        logout:String
    },
    type Query{
        getEvents(token: String): String
    }
`;

export default typeDefs;
