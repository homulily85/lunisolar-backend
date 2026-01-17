const typeDefs = /*GraphQL*/ `
    type User {
        name:String,
        id: ID,
        token: String,
        profilePictureLink: String
    },
    type Mutation{
        auth(token:String): User
    },
    type Query{
        getEvents(token:String):String
    }
`;

export default typeDefs;
