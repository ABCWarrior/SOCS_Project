// Phililp
import { config } from 'dotenv';
config({ path: '../.env' });

import { MongoClient } from 'mongodb';

const databaseURI = process.env.MONGO_URI;
const mongoDatabaseName = process.env.MONGO_DATABASE_NAME;

const connection = new MongoClient(databaseURI);

try {
  await connection.connect();
  console.log(`Connection created to ${databaseURI}`)
}
catch (err) {
  console.log(`Connection failed to ${databaseURI}`)
}

const database = connection.db(mongoDatabaseName)

export default database;
