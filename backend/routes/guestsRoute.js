import { Router } from 'express';

import { bookingsEnums } from '../enums/bookingsEnums.js';
import { getGuestAttendance } from '../services/guestsService.js';

const guestsRouter = Router();

guestsRouter.get('/', async (req, res) => {
  const { email } = req.headers;
  const { status, attendances } = await getGuestAttendance(email);
  return status == bookingsEnums.SUCCESSFUL_BOOKING_QUERY ?
    res.status(200).json({ message: "Successfully retrieved guest attendances", attendances }) :
    res.status(500).json({ message: "Unable to retrieve guest attendances", attendances })
})

export default guestsRouter;
