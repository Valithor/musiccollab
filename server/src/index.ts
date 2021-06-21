import 'reflect-metadata';
import "dotenv-safe/config"
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { RoomResolver } from './resolvers/room';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Room } from './entities/Room';
import { User } from './entities/User';
import { UserRoom } from './entities/UserRoom';
import { Sound } from './entities/Sound';
import { RoomSound } from './entities/RoomSound';
import { SoundResolver } from './resolvers/sound';
import { createUserLoader } from './utils/createUserLoader';
import { createUserRoomLoader } from './utils/createUserRoomLoader';
import path from 'path';
// import * as PostgressConnectionStringParser from 'pg-connection-string';
// import dotenv from 'dotenv';
// const config = dotenv.config();

require('dotenv').config({path: __dirname + '/.env'})

const main = async () => {
  // const connectionOptions = PostgressConnectionStringParser.parse(process.env.DATABASE_URL as string)
  
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,    
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Room, User, UserRoom, Sound, RoomSound],
    ssl: {
      rejectUnauthorized: false
    }
  });
  // await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  app.set("proxy", 1);
  const redis = new Redis(process.env.REDIS_URL);
  app.use(
    cors({
      origin: [process.env.CORS_ORIGIN, "http://83.24.54.164:3000"],
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: false,
        sameSite: 'lax',
        // domain: __prod__ ? '.codeponder.com': undefined
        //csrf
        //secure: __prod__ //coookie only works in https
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  )
  app.use(express.static('public/sounds'));

  const apolloServer = new ApolloServer({
    introspection: true,
    playground: true,  
    schema: await buildSchema({
      resolvers: [HelloResolver, RoomResolver, UserResolver, SoundResolver],
      validate: false,

    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      userRoomLoader: createUserRoomLoader()
    }),
  });

  const http = require('http').createServer(app)
  // const io = require('socket.io')(http)
  apolloServer.installSubscriptionHandlers(http);

  // io.on('connection', function (socket: any) {
  //   socket.on('message', ({ track, trackId, roomId }: any) => {
  //     io.emit('message', { track, trackId, roomId })
  //   })
  //   socket.on('concat', (id: number) => {
  //     io.emit('concat', { id })
  //   })
  // })
  // io.on("connected", ()=>{
  //   console.log("hello mello")
  // })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  http.listen(parseInt(process.env.PORT), () => {
    console.log(`Server started on ${process.env.PORT}`)
  });
};

main();

