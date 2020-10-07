import { createConnection } from 'typeorm'

export const db = async () => {
  // if you don't use any options on createConnection(), createConnection looks for .ormconfig.json automatically.
  const connection = await createConnection()
    .catch(error => {
      console.error('TypeORM Error: Fail to connect ', error)
    });
}