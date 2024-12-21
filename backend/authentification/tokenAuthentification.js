// Philip
import crypto from 'crypto';
import database from '../database/connectDatabase.js';

const tokensCollection = database.collection(process.env.MONGO_TOKENS_COLLECTION);
await tokensCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 900 });

export const tokenCreation = (id) => {
  const token = crypto.createHash('sha256').update(id.toString()).digest('hex');
  const expiresAt = new Date(Date.now());
  return { tokenValidation: { token, id }, expiresAt }
}

export const privatePageAuthentication = async (token, id) => {
  try {
    return await tokensCollection.findOne({ tokenValidation: { token, id } }) != null ? true : false;
  }
  catch (err) {
    console.error("Error querying token ", err)
    return false;
  }
}

export const passwordHashingForRegistration = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
}
export const logoutSecurity = (req, res) => {
  const { token } = req.body;
  const tokenDocument = tokensCollection.findOne({ tokenValidation: { token, id: req.params.id } })

  if (tokenDocument) {
    tokensCollection.deleteOne({ tokenValidation: { token, id: req.params.id } });
  }

  res.redirect(301, '/')
}
