import { Router } from 'express';

import { privatePageAuthentication, logoutSecurity } from '../authentification/tokenAuthentification.js';
import { getAllBookingsService, createBookingService, editBookingService, getAllAppointmentRequests, deleteAppointmentRequest, deleteBookingService } from '../services/bookingServices.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';

const membersRouter = Router();

membersRouter.get('/:id/dashboard', async (req, res) => {
  const { token } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return;
  }

  const { status, all_bookings } = await getAllBookingsService(req.params.id);
  return status == bookingsEnums.SUCCESSFUL_BOOKING_QUERY ?
    res.status(200).json({ message: status, all_bookings }) :
    res.status(500).json({ message: status, all_bookings })
})

membersRouter.post('/:id/create_booking', async (req, res) => {
  const { token, professor, date, startTime, endTime } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const { status, code } = await createBookingService(req.params.id, professor, date, startTime, endTime);
  return status == bookingsEnums.SUCCESSFUL_BOOKING_CREATION ?
    res.status(201).json({ message: "Succesfullly created an appointment", code }) :
    res.status(500).json({ message: "Failed to create booking" });
})

membersRouter.post('/:id/edit_booking', async (req, res) => {
  const { token, professor, date, startTime, endTime } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const status = await editBookingService(req.params.id, professor, date, startTime, endTime);
  return status == bookingsEnums.SUCCESSFUL_BOOKING_EDIT ?
    res.status(201).json({ message: "Succesfully edited the appointment" }) :
    res.status(500).json({ message: "Failed to edit booking" });
})

membersRouter.post('/:id/delete_booking', async (req, res) => {
  const { token, professor, date, startTime, endTime } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const status = await deleteBookingService(req.params.id, professor, date, startTime, endTime);
  return status == bookingsEnums.SUCCESSFUL_BOOKING_DELETION ?
    res.status(201).json({ message: "Succesfully delete booking" }) :
    res.status(500).json({ message: "Failled to delete booking" });
})

membersRouter.get('/:id/request_appointments', async (req, res) => {
  const { token } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  return res.status(200).json(await getAllAppointmentRequests(req.params.id));
})

membersRouter.post('/:id/request_appointments/confirm_or_deny', async (req, res) => {
  const { token, answer, professor, date, startTime, endTime } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  await deleteAppointmentRequest(req.params.id, professor, date, startTime, endTime);

  if (answer) {
    const status = await createBookingService(req.params.id, professor, date, startTime, endTime);
    return status == bookingsEnums.SUCCESSFUL_BOOKING_DELETION ?
      res.status(201).json({ message: "Succesfullly created an appointment", code }) :
      res.status(500).json({ message: "Failed to create booking", error: status });
  }
  else {
    return res.status(201).json({ message: "Succesfully rejected an appointment" })
  }
})

membersRouter.post('/:id/logout', (req, res) => {
  logoutSecurity(req, res);
})


export default membersRouter
