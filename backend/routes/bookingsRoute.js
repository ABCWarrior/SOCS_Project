import { Router } from 'express';
import { ObjectId } from 'mongodb';

import database from '../database/connectDatabase.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);

const bookingsRouter = Router();

bookingsRouter.get('/:id', async (req, res) => {
  const booking = await bookingsCollection.findOne({ _id: new ObjectId(req.params.id) });
  return booking != null ? res.status(200).json({
    message: "Successful booking query",
    booking: { professor: booking.professor, date: booking.date, startTime: booking.startTime, endTime: booking.endTime }
  }) :
    res.status(500).json({ message: "Unable to find booking" })
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

// Not sure whether to call this "appointment_request" something else since this is similar to the call in membersRoute
bookingsRouter.post('/:id/appointment_request', async (req, res) => {
  const { userEmail, professor, date, startTime, endTime } = req.body;
  const professorDatabaseId = req.params.id;
  const result = await createAppointmentRequestService(
    userEmail,
    professorDatabaseId, 
    professor,
    date,
    startTime,
    endTime
  );
  
  if (result.status === bookingsEnums.SUCCESSFUL_REQUEST_CREATION) {
    return res.status(201).json({ 
      message: "Successfully created appointment request",
      requestId: result.requestId 
    });
  }
  
  return res.status(500).json({ 
    message: "Failed to create appointment request" 
  });
});
export default bookingsRouter;
