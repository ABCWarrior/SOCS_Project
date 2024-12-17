import moment from 'moment';

import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';
import sendAutomatedEmail from './emailService.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION)
const requestAppointmentsCollection = database.collection(process.env.MONGO_REQUEST_APPOINTMENTS_COLLECTION);

const hasOverlappingBookings = (bookings, startMoment, endMoment) => {
  const overlaps = []

  bookings.forEach((booking) => {
    const currStartMoment = moment(booking.startTime, "HH:mm", true);
    const currEndMoment = moment(booking.endTime, "HH:mm", true);

    if (currStartMoment.isBefore(endMoment) && startMoment.isBefore(currEndMoment) ||
      currStartMoment.isSame(startMoment) ||
      currEndMoment.isSame(endMoment)) {
      overlaps.push(booking)
    };
  })

  return overlaps.length == 0 || overlaps == undefined ? false : true;
}

const overlappingBookingsList = (bookings, startMoment, endMoment) => {
  const overlaps = [];

  bookings.forEach((booking) => {
    const currStartMoment = moment(booking.startTime, "HH:mm", true);
    const currEndMoment = moment(booking.endTime, "HH:mm", true);

    if (currStartMoment.isBefore(endMoment) && startMoment.isBefore(currEndMoment) ||
      currStartMoment.isSame(startMoment) ||
      currEndMoment.isSame(endMoment)) {
      overlaps.push(booking)
    };
  })

  return overlaps;
}

export const getBookingDetailsForUser = async (bookingId) => {
  try {
    return { booking: await bookingsCollection.findOne({ _id: bookingId }) }
  }
  catch (err) {
    console.log(err);
    return { booking: [] }
  }
}

export const getAllBookingsService = async (professorDatabaseId, protocol, host) => {
  try {
    return {
      status: bookingsEnums.SUCCESSFUL_BOOKING_QUERY, all_bookings:
        (await bookingsCollection.find({ professorDatabaseId }).toArray()).map(booking => {
          return {
            ...booking, url: `${protocol}://${host}/bookings/${booking._id}`
          }
        })
    }
  }
  catch (err) {
    console.error(err);
    return { status: bookingsEnums.DATABASE_OPERATION_ERROR, all_bookings: [] };
  }
}

export const createBookingService = async (professorDatabaseId, professor, date, startTime, endTime, isRecurring) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;
    if (hasOverlappingBookings(await bookingsCollection.find({ professorDatabaseId, professor, date }).toArray(), startMoment, endMoment)) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    const insertionResult = await bookingsCollection.insertOne({ professorDatabaseId, professor, date, startTime, endTime, isRecurring });
    return { status: bookingsEnums.SUCCESSFUL_BOOKING_CREATION, bookingCode: insertionResult.insertedId.toString() };
  }
  catch (err) {
    console.error(err);
    return { status: bookingsEnums.DATABASE_OPERATION_ERROR, bookingCode: "" };
  }
}

export const createBookingServiceWithParticipant = async (professorDatabaseId, professor, date, startTime, endTime, isRecurring, email) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;
    if (hasOverlappingBookings(await bookingsCollection.find({ professorDatabaseId, professor, date }).toArray(), startMoment, endMoment)) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    const insertionResult = await bookingsCollection.insertOne({ professorDatabaseId, professor, date, startTime, endTime, isRecurring, participants: [email] });
    sendAutomatedEmail(`${professor} Has Accepted Your Appointment Request`,
      `${professor} has accepted your appointment request from at ${date} from ${startTime} to ${endTime} and you have been automatically registerd to it.`,
      [email]
    );
    return { status: bookingsEnums.SUCCESSFUL_BOOKING_CREATION, bookingCode: insertionResult.insertedId.toString() };
  }
  catch (err) {
    console.error(err);
    return { status: bookingsEnums.DATABASE_OPERATION_ERROR, bookingCode: "" };
  }
}

export const editBookingService = async (professorDatabaseId, professor, date, startTime, endTime, isRecurring) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;

    const overlappingBookings = overlappingBookingsList(await bookingsCollection.find({ professorDatabaseId, professor, date }).toArray(), startMoment, endMoment);
    console.log(overlappingBookings);//test
    if (overlappingBookings.length != 1) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    await bookingsCollection.updateOne({ _id: overlappingBookings[0]._id }, { $set: { professorDatabaseId, professor, date, startTime, endTime, isRecurring } });

    sendAutomatedEmail(`Booking Time Change for ${professor}`,
      `This is a notice that the booking with ${professor} which was during ${overlappingBookings[0].date} from ${overlappingBookings[0].startTime} to ${overlappingBookings[0].endTime} 
          has been changed to ${date} from ${startTime} to ${endTime} and ${isRecurring ? "is" : "is not"} recurring. \n
        Please sign up again to the booking with id ${overlappingBookings[0].id}`,
      overlappingBookings[0].participants);

    return bookingsEnums.SUCCESSFUL_BOOKING_EDIT;
  }
  catch (err) {
    console.error(err);
    return bookingsEnums.DATABASE_OPERATION_ERROR;
  }
}

export const deleteBookingService = async (professorDatabaseId, professor, date, startTime, endTime) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;

    const previousBooking = await bookingsCollection.findOne({ professorDatabaseId, professor, date, startTime, endTime });
    //console.log(previousBooking)//test
    await bookingsCollection.deleteOne({ professorDatabaseId, professor, date, startTime, endTime });

    sendAutomatedEmail(`Booking Deletion for ${professor}`,
      `This is a notice that the booking with ${professor} at ${previousBooking.date} from ${previousBooking.startTime} to ${previousBooking.endTime} has been been cancelled.`,
      previousBooking.participants);

    return bookingsEnums.SUCCESSFUL_BOOKING_DELETION;
  }
  catch (err) {
    console.error(err);
    return bookingsEnums.DATABASE_OPERATION_ERROR;
  }
}

export const getAllAppointmentRequests = async (professorDatabaseId) => {
  try {
    return { appointmentRequests: await requestAppointmentsCollection.find({ 'requestedAppointment.professorDatabaseId': professorDatabaseId }).toArray() };
  }
  catch (err) {
    console.error(err)
    return { appointmentRequests: [] }
  }
}

export const deleteAppointmentRequest = async (professorDatabaseId, professor, date, startTime, endTime) => {
  try {
    await requestAppointmentsCollection.deleteOne({ requestedAppointment: { professorDatabaseId, professor, date, startTime, endTime } })
  }
  catch (err) {
    console.error(err);
    return;
  }
}

export const createAppointmentRequestService = async (userEmail, professorDatabaseId, professor, date, startTime, endTime) => {
  try {
    const insertionResult = await requestAppointmentsCollection.insertOne({
      requestingEmail: userEmail,
      requestedAppointment: {
        professorDatabaseId,
        professor,
        date,
        startTime,
        endTime
      }
    });
    
    return { 
      status: bookingsEnums.SUCCESSFUL_REQUEST_CREATION, 
      requestId: insertionResult.insertedId.toString() 
    };
  } catch (err) {
    console.error(err);
    return { 
      status: bookingsEnums.DATABASE_OPERATION_ERROR, 
      requestId: "" 
    };
  }
}