import { Router } from 'express';
import { config } from 'dotenv';
config({ path: '../../.env' });

import getDatabase from '../database/connectDatabase.js'

const membersDatabase = getDatabase()
const loginRouter = Router();

const membersCollectionName = process.env.MONGO_MEMBERS_COLLECTION

loginRouter.get('/', async (req, res) => {
  res.send("Validate login")
})

loginRouter.post('/registration', async (req, res) => {
  const { email, password } = req.body
  console.log(`Email: ${email} and Password: ${password}`);

  try {
    const membersCollection = membersDatabase.collection(membersCollectionName)
    const newMember = { email, password }

    await membersCollection.insertOne(newMember)

    res.status(201).json({ message: "Registation complete" })
  }
  catch (err) {
    res.status(400).json({ message: "Error during registration with error: ", err })
  }
})

export default loginRouter;
