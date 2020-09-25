import express from 'express';
import { createConnection } from 'typeorm'

const main = async () => {
  const app = express()

  // if you don't use any options on createConnection(), createConnection looks for .ormconfig.json automatically.
  const connection = await createConnection()
    .catch(error => {
      console.error('TypeORM Error: Fail to connect ', error)
    });

  app.listen(4000, () => {
    console.log('listening on localhost:4000')
  })
}

export default main