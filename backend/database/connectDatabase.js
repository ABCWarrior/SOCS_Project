import { config } from 'dotenv';
config({ path: '../.env' });

import { MongoClient } from 'mongodb';

const databaseURI = process.env.MONGO_URI;
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoDatabaseName = process.env.MONGO_DATABASE_NAME;

console.log("Mongo_URI:", databaseURI);//test
const connection = new MongoClient(databaseURI);

const getDatabase = async () => {
  try {
    await connection.connect().db(mongoDatabaseName);
    console.log(`Connection created to ${mongoDatabaseName}`)
  }
  catch (err) {
    console.log(`Connection failed to ${mongoDatabaseName}`)
  }
}

export default getDatabase;
