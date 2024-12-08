import crypto from 'crypto';
import { Router } from 'express';
import { config } from 'dotenv';
config({ path: '../../.env' });

import database from '../database/connectMembersDatabase.js'

const membersCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION);
const tokensCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION);

await tokensCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 900 });

const loginRouter = Router();

const tokenCreation = () => {
  const token = crypto.createHash('sha256').update(email + password).digest('hex');
  const expiresAt = new Date(Date.now());
  return { token, expiresAt }
}

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await membersCollection.findOne({ email });

    if (member && member.password === password) {
      await tokensCollection.insertOne(tokenCreation());
      res.status(200).json({ message: "Successful login", token: token });
    }
    else {
      res.status(404).json({ message: "Member not found. Please verify you have the right email and password." });
    }
  }
  catch (err) {
    res.status(500).json({ message: "Unable to query member" });
  }

})

loginRouter.post('/registration', async (req, res) => {
  const { email, password } = req.body

  try {
    const newMember = { email, password }
    const member = await membersCollection.findOne({ email });

    if (!member) {
      await membersCollection.insertOne(newMember);
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
