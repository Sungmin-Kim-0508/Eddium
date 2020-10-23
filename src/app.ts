
import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import { db } from './db'
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user.resolver';
import { HttpContext } from './types'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { COOKIE_NAME, __prod__ } from './constants';

const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  db();

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // one day
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax'
      },
      saveUninitialized: false,
      secret: 'secret key',
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false
    }),
    context: ({ req, res }: HttpContext) => ({ req, res })
  })

  // when you are on production. you have to change the address for origin.
  apolloServer.applyMiddleware({ app, cors: { origin: 'http://localhost:3000', credentials: true } })

  app.listen(PORT, () => {
    console.log('listening on localhost:4000/graphql');
  });
}

export default main