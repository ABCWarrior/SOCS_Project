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

const isValidMcGillEmail = (email) => {
  const mcgillEmailRegex = /^[a-zA-Z0-9._%+-]+@(mail\.mcgill\.ca|mcgill\.ca)$/;
  return mcgillEmailRegex.test(email);
};

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!isValidMcGillEmail(email)) {
    return res.status(400).json({ message: "Invalid McGill email address" });
  }

  try {
    const member = await membersCollection.findOne({ email });

    if (member && member.password === password) {
      // TODO: Make tokenCreation randomized on login
      const tokenDocument = tokenCreation(member._id.toString());
      await tokensCollection.insertOne(tokenDocument);
      console.log("uniqueId for pages: ", member._id.toString());//test
      res.status(200).json({ 
        message: "Successful login", 
        token: tokenDocument.tokenValidation.token, 
        id: member._id,
        professor: member.professor, 
        professorName: member.professor
      });
    }
    else {
      // TODO: Could seperate checks to see if email is registered and if it is, wrong password
      res.status(404).json({ message: "Please verify you have the right email and/or password." });
    }
  }
  catch (err) {
    res.status(500).json({ message: "Unable to query member" });
  }

})

loginRouter.post('/registration', async (req, res) => {
  const { professor, email, password } = req.body

  if (!isValidMcGillEmail(email)) {
    return res.status(400).json({ message: "Only McGill email addresses (@mail.mcgill.ca or @mcgill.ca) are allowed" });
  }

  try {
    const newMember = { professor, email, password };
    const member = await membersCollection.findOne({ email });

    if (!member || !member.password) {
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

loginRouter.post('/checkEmail', async (req, res) => {
  const { email } = req.body;

  try {
    const member = await membersCollection.findOne({ email });

    if (!member) {
      await membersCollection.insertOne({ email });
      return res.status(200).json({ exists: true });
    }

    if (member.password) {
      return res.status(200).json({ exists: false });
    } else {
      return res.status(200).json({ exists: true });
    }
  } catch (err) {
    res.status(500).json({ message: "Error checking email", error: err });
  }
});

export default loginRouter;
