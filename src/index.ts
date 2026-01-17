import express from "express";
import cors from "cors";
import { FRONTEND_URL, MONGO_URI, PORT } from "./utils/config";
import morgan from "morgan";
import { connectToDatabase } from "./utils/db";
import * as http from "http";
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";

const main = async () => {
    await connectToDatabase(MONGO_URI);

    const app = express();
    app.use(express.json());

    app.use(
        morgan(":method :url :status :res[content-length] - :response-time ms"),
    );

    app.use(cors({ origin: FRONTEND_URL }));

    app.get("/ping", (_req, res) => {
        res.send("pong");
    });

    const httpServer = http.createServer(app);
    const graphQLServer = new ApolloServer({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await graphQLServer.start();

    app.use("/graphql", expressMiddleware(graphQLServer));

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void main();
