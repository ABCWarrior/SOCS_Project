import { Router } from 'express';

import database from '../database/connectDatabase.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);

const bookingsRouter = Router();

bookingsRouter.get('/:id', async (req, res) => {
  const booking = bookingsCollection.findOne({ _id: req.params.id });
  return booking != null ? res.status(200).json({ message: "Successful booking query", booking }) : res.status(500).json({ message: "Unable to find booking" })
})

bookingsRouter.post('/:id', async (req, res) => {
  const { email } = req.body;
  try {
    const booking = bookingsCollection.findOne({ _id: req.params.id });
    if (booking == null) return res.status(500).json({ message: "Booking does not exist" });

    bookingsCollection.updateOne({ _id: booking._id }, { $push: { participants: email } });
    return res.status(201).json({ message: "Successfully added you as a participant" });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to add you as a participant" });
  }
})
