import { Router } from 'express';

import { privatePageAuthentification, logoutSecurity } from '../authentification/tokenAuthentification.js';
import { createBookingService, editBookingService, getAllAppointmentRequests } from '../services/bookingServices.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';

const membersRouter = Router();

membersRouter.post('/:id/dashboard', (req) => {
  if (!privatePageAuthentification(req)) res.redirect(301, '/');
  res.status(200).json({ message: `Allowed to View ${pageName} Page` });
})

membersRouter.post('/:id/edit_booking', async (req, res) => {
  const { token, professor, date, startTime, endTime } = req.body;

  if (!privatePageAuthentification(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const editBookingsResponse = await editBookingService(professor, date, startTime, endTime);
  return editBookingsResponse = bookingsEnums.SUCCESSFUL_BOOKING_EDIT ?
    res.status(201).json({ message: "Succesfully edited the appointment" }) :
    res.status(500).json({ message: "Failed to edit booking because of the following error", editBookingsResponse });
})

membersRouter.post('/:id/create_booking', async (req, res) => {
  const { token, professor, date, startTime, endTime } = req.body;

  if (!privatePageAuthentification(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const createBookingResponse = await createBookingService(professor, date, startTime, endTime);
  return createBookingResponse == bookingsEnums.SUCCESSFUL_BOOKING_CREATION ?
    res.status(201).json({ message: "Succesfullly created an appointment" }) :
    res.status(500).json({ message: "Failed to create booking because of the following error: ", createBookingResponse });
})

membersRouter.get('/:id/request_appointments', async (req, res) => {
  const { token } = req.body;

  if (!privatePageAuthentification(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  return res.status(200).json(await getAllAppointmentRequests(req.params.id));
})

membersRouter.post('/:id/request_appointments/confirm', async (req, res) => {
  const { token, professor, date, startTime, endTime } = req.body;

  if (!privatePageAuthentification(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const createBookingResponse = await createBookingService(professor, date, startTime, endTime);
  return createBookingResponse == bookingsEnums.SUCCESSFUL_BOOKING_CREATION ?
    res.status(201).json({ message: "Succesfullly created an appointment" }) :
    res.status(500).json({ message: "Failed to create booking because of the following error: ", createBookingResponse });
})

membersRouter.post('/:id/logout', (req, res) => {
  logoutSecurity(req, res);
})


export default membersRouter
