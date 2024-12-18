import { Router } from 'express';

import { privatePageAuthentication, logoutSecurity } from '../authentification/tokenAuthentification.js';
import { getAllBookingsService, createBookingService, createBookingServiceWithParticipant, editBookingService, getAllAppointmentRequests, deleteAppointmentRequest, deleteBookingService } from '../services/bookingServices.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';
import sendAutomatedEmail from '../services/emailService.js';

const membersRouter = Router();

// In membersRoute for now but might want to move to loginRoutes?
membersRouter.get('/name', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const member = await membersCollection.findOne({ email }, { projection: { professor: 1 } });

    if (!member) {
      return res.status(404).json({ message: "No member found with this email" });
    }

    res.status(200).json({ professor: member.professor });
  } catch (err) {
    console.error("Error fetching name:", err);
    res.status(500).json({ message: "Failed to fetch name", error: err.message });
  }
});

membersRouter.get('/:id/dashboard', async (req, res) => {   
    const token = req.query.token; // Extract token from query parameters
    
    if (!await privatePageAuthentication(token, req.params.id)) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        redirectUrl: '/' 
      }); // Send an error response instead of redirecting
    }
    
    const { status, all_bookings } = await getAllBookingsService(req.params.id, req.protocol, req.get('host'));
    return status == bookingsEnums.SUCCESSFUL_BOOKING_QUERY ?
      res.status(200).json({ message: status, all_bookings }) :
      res.status(500).json({ message: status, all_bookings });
});

membersRouter.post('/:id/create_booking', async (req, res) => {
  // Note here that date can either be a specific date, or a day of the week
  const { token, professor, date, startTime, endTime, isRecurring } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const { status, code } = await createBookingService(req.params.id, professor, date, startTime, endTime, isRecurring);
  return status == bookingsEnums.SUCCESSFUL_BOOKING_CREATION ?
    res.status(201).json({ message: "Succesfullly created an appointment", code }) :
    res.status(500).json({ message: "Failed to create booking" });
})

membersRouter.post('/:id/edit_booking', async (req, res) => {
  // Note here that date can either be a specific date, or a day of the week
  const { token, bookingId, professor, date, startTime, endTime, isRecurring } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  const status = await editBookingService(req.params.id, bookingId, professor, date, startTime, endTime, isRecurring);
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
    res.status(500).json({ message: "Failed to delete booking" });
})

membersRouter.get('/:id/request_attendance', async (req, res) => {
  const { token, email } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return;
  }

  const { status, attendances } = await getMemberAttendance(email);

  if (status === bookingsEnums.SUCCESSFUL_BOOKING_QUERY) {
    return res.status(200).json({ message: "Successfully fetched attendance data", attendances });
  }
  else {
    return res.status(500).json({ message: "Failed to fetch attendance data", attendances });
  }
});

membersRouter.get('/:id/request_appointments', async (req, res) => {
  const { token } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  return res.status(200).json(await getAllAppointmentRequests(req.params.id));
})

membersRouter.post('/:id/request_appointments/confirm_or_deny', async (req, res) => {
  const { token, answer, professor, date, startTime, endTime, isRecurring, email } = req.body;

  if (!await privatePageAuthentication(token, req.params.id)) {
    res.redirect(301, '/');
    return
  }

  await deleteAppointmentRequest(req.params.id, professor, date, startTime, endTime);

  if (answer) {
    const status = await createBookingServiceWithParticipant(req.params.id, professor, date, startTime, endTime, isRecurring, email);
    return status == bookingsEnums.SUCCESSFUL_BOOKING_DELETION ?
      res.status(201).json({ message: "Succesfullly created an appointment", code }) :
      res.status(500).json({ message: "Failed to create booking", error: status });
  }
  else {
    sendAutomatedEmail(`${professor} Has Rejected Your Appointment Request`,
      `${professor} has rejected your appointment request at ${date} from ${startTime} to ${endTime}`,
      [email])
    return res.status(201).json({ message: "Succesfully rejected an appointment" })
  }
})

membersRouter.post('/:id/logout', (req, res) => {
  logoutSecurity(req, res);
})


export default membersRouter
