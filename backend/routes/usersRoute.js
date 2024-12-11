import { Router } from 'express';

import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';
import { getBookingDetailsForUser } from '../services/bookingServices.js';

const usersRouter = Router();
const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECITON);

usersRouter.get('/:id', async (req, res) => {
  const { status, booking } = getBookingDetailsForUser(req.params.id);
  return status == bookingsEnums.SUCCESSFUL_BOOKING_QUERY ?
    res.status(200).json({ message: "Successful booking query", booking }) :
    res.status(500).json({ message: "Unable to query booking", booking })
})

export default usersRouter;
