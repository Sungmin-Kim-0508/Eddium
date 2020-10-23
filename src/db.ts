import { createConnection } from 'typeorm'

export const db = async () => {
  try {
    // if you don't use any options on createConnection(), createConnection looks for .ormconfig.json automatically.
    await createConnection();
    // await connection.dropDatabase();
    // await connection.synchronize();
  } catch (error) {
    console.error('TypeORM Error: Fail to connect ', error)
  }
}