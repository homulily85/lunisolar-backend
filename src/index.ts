import express from "express";
import { MONGO_URI, PORT } from "./utils/config";
import morgan from "morgan";
import { connectToDatabase } from "./utils/db";
import * as http from "http";
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cookieParser from "cookie-parser";
import getAccessTokenPayload from "./service/getAccessTokenPayload";

const main = async () => {
    await connectToDatabase(MONGO_URI);

    const app = express();

    app.use(cookieParser());
    app.use(express.json());

    app.use(
        morgan(":method :url :status :res[content-length] - :response-time ms"),
    );

    app.get("/ping", (_req, res) => {
        res.send("pong");
    });

    const httpServer = http.createServer(app);
    const graphQLServer = new ApolloServer({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await graphQLServer.start();

    app.use(
        "/api/graphql",
        expressMiddleware(graphQLServer, {
            // eslint-disable-next-line @typescript-eslint/require-await
            context: async ({ req, res }) => {
                const authorization = req.headers.authorization;
                if (!authorization || !authorization.startsWith("Bearer ")) {
                    return { req, res };
                }

                const accessToken = authorization.substring(7);

                const contextString = req.cookies["accessContext"] as string;
                const tokenPayload = getAccessTokenPayload(
                    accessToken,
                    contextString,
                );
                return { req, res, tokenPayload };
            },
        }),
    );

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void main();
