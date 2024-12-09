import database from '../database/connectDatabase.js';

const tokensCollection = database.collection(process.env.MONGO_TOKENS_COLLECTION);

export const privatePageAuthentification = async (req, res, pageName) => {
  const { token } = req.body;
  const tokenDocument = await tokensCollection.findOne({ tokenValidation: { token, id: req.params.id } })

  if (!tokenDocument) {
    res.redirect(301, '/');
    return;
  }
  res.status(200).json({ message: `Allowed to View ${pageName} Page` });
}
