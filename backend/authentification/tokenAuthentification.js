import database from '../database/connectDatabase.js';

const tokensCollection = database.collection(process.env.MONGO_TOKENS_COLLECTION);

export const privatePageAuthentification = (token, id) => {
  try {
    return tokensCollection.findOne({ tokenValidation: { token, id } }) ? true : false;
  }
  catch (err) {
    console.error("Error querying token ", err)
    return false;
  }
}

export const logoutSecurity = (req, res) => {
  const { token } = req.body;
  const tokenDocument = tokensCollection.findOne({ tokenValidation: { token, id: req.params.id } })

  if (tokenDocument) {
    tokensCollection.deleteOne({ tokenValidation: { token, id: req.params.id } });
  }

  res.redirect(301, '/')
}
