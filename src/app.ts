
import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import { db } from './db'
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user.resolver';

const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  db();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false
    })
  })

  apolloServer.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log('listening on localhost:4000');
  });
}

export default main