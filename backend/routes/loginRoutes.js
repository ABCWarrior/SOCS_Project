import { Router } from 'express';
import { config } from 'dotenv';
config({ path: '../../.env' });

import database from '../database/connectDatabase.js'

const usersCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION)

const loginRouter = Router();

loginRouter.get('/', async (req, res) => {
  res.send("Validate login")
})

loginRouter.post('/registration', async (req, res) => {
  const { email, password } = req.body
  console.log(`Email: ${email} and Password: ${password}`);

  try {
    const newMember = { email, password }
    await usersCollection.insertOne(newMember)

    res.status(201).json({ message: "Registation complete" })
  }
  catch (err) {
    res.status(400).json({ message: "Error during registration with error: ", err })
  }
})

export default loginRouter;
