import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from "./gql/typeDefs";
import resolvers from "./gql/resolvers";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
require("dotenv").config();

declare module "express-session" {
  interface Session {
    userId: string;
    loadedCount: number;
    test: string;
  }
}

const main = async () => {
  const app = express();

  app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  }))

  const router = express.Router();

  try {
    await createConnection();
  } catch (err) {
    console.log(err);
  }

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({
    client: redis,
  });

  app.use(express.json());

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: "Strict",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    } as any)
  );

  app.use(router);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const apolloServer = new ApolloServer({
    schema,
    context: ({req, res}: any) => ({ req, res })
  })

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.SERVER_PORT;

  app.listen({ port }, () => {
    console.log(`server running on port ${port}...`);
  });
};

main();
