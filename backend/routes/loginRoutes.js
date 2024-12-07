import { Router } from 'express';
import { config } from 'dotenv';
config({ path: '../../.env' });

import database from '../database/connectDatabase.js'

const membersCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION)

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  try {
    const member = await membersCollection.findOne({ email })

    if (member && member.password === password) {
      res.status(200).json({ message: "Successful login" })
    }
    else {
      res.status(404).json({ message: "Member not found. Please verify you have the right email and password." })
    }
  }
  catch (err) {
    res.status(500).json({ message: "Unable to query member" })
  }

})

loginRouter.post('/registration', async (req, res) => {
  const { email, password } = req.body

  try {
    const newMember = { email, password }
    const member = await membersCollection.findOne({ email });

    if (!member) {
      await membersCollection.insertOne(newMember)
      res.status(201).json({ message: "Successful Registration" })
    }
    else {
      res.status(409).json({ message: "Member already exist with this email. Please login to this account or create a new account." })
    }
  }
  catch (err) {
    res.status(400).json({ message: "Error during registration with error: ", err })
  }
})

export default loginRouter;
