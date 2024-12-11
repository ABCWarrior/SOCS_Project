import crypto from 'crypto';
import { Router } from 'express';

import database from '../database/connectDatabase.js'

const membersCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION);
const tokensCollection = database.collection(process.env.MONGO_TOKENS_COLLECTION);
await tokensCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 900 });

const loginRouter = Router();

const tokenCreation = (id) => {
  const token = crypto.createHash('sha256').update(id.toString()).digest('hex');
  const expiresAt = new Date(Date.now());
  return { tokenValidation: { token, id }, expiresAt }
}

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await membersCollection.findOne({ email });

    // how to redirect here? I need to redirect to a page while also giving a token
    if (member && member.password === password) {
      const tokenDocument = tokenCreation(member._id.toString());
      await tokensCollection.insertOne(tokenDocument);
      console.log("uniqueId for pages: ", member._id.toString());//test
      res.status(200).json({ message: "Successful login", token: tokenDocument.tokenValidation.token });
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
    const newMember = { professor, email, password };
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
