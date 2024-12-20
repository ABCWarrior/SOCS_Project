import { Router } from 'express';
import { ObjectId } from 'mongodb';

import { createAppointmentRequestService, addParticipantToBookingService } from '../services/bookingServices.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';

import database from '../database/connectDatabase.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);
const membersCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION);

const bookingsRouter = Router();

bookingsRouter.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid booking code format"
      });
    }

    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!booking) {
      return res.status(404).json({
        message: "Unable to find booking"
      });
    }

    return res.status(200).json({
      message: "Successful booking query",
      booking: {
        professor: booking.professor,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        _id: booking._id,
        isRecurring: booking.isRecurring,
        professorDatabaseId: booking.professorDatabaseId
      }
    });
  } catch (error) {
    console.error('Booking query error:', error);
    return res.status(500).json({
      message: "Server error while finding booking"
    });
  }
});

bookingsRouter.post('/:id/add_participants', async (req, res) => {
  const { email } = req.body;
  const meetingID = req.params.id;
  console.log(email)
  console.log(meetingID)

  const result = await addParticipantToBookingService(meetingID, email);

  if (result.status === bookingsEnums.SUCCESSFUL_BOOKING_UPDATE) {
    return res.status(201).json({ message: result.message });
  }

  return res.status(500).json({ message: result.message });
});

bookingsRouter.post('/:booking_id/appointment_request', async (req, res) => {
  const { userEmail, professor, date, startTime, endTime } = req.body;
  const { professorDatabaseId } = await bookingsCollection.findOne({ _id: new ObjectId(req.params.booking_id) })
  if (!professorDatabaseId)
    {
      return res.status(500).json({message: "Professor not found"})
    }
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
