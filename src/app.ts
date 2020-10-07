import express from 'express';
import { db } from './db'

const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  db();

  app.listen(PORT, () => {
    console.log('listening on localhost:4000');
  });
}

export default main