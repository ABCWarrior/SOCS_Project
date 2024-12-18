import moment from 'moment';

import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';
import sendAutomatedEmail from './emailService.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION)
const requestAppointmentsCollection = database.collection(process.env.MONGO_REQUEST_APPOINTMENTS_COLLECTION);

const DAYS_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const hasOverlappingBookings = (bookings, startMoment, endMoment) => {
  const overlaps = []

  bookings.forEach((booking) => {
    const currStartMoment = moment(booking.startTime, "HH:mm", true);
    const currEndMoment = moment(booking.endTime, "HH:mm", true);
    const bookingDate = new Date(booking.date);

    if (isRecurring && DAYS_OF_THE_WEEK[bookingDate.getDay()] != date) return;

    if (currStartMoment.isBefore(endMoment) && startMoment.isBefore(currEndMoment) ||
      currStartMoment.isSame(startMoment) ||
      currEndMoment.isSame(endMoment)) {
      overlaps.push(booking)
    };
  })

  return overlaps.length == 0 || overlaps == undefined ? false : true;
}

const overlappingBookingsList = (bookings, startMoment, endMoment, date, isRecurring) => {
  const overlaps = [];

  bookings.forEach((booking) => {
    const currStartMoment = moment(booking.startTime, "HH:mm", true);
    const currEndMoment = moment(booking.endTime, "HH:mm", true);
    const bookingDate = new Date(booking.date);

    if (isRecurring && DAYS_OF_THE_WEEK[bookingDate.getDay()] != date) return;

    if (currStartMoment.isBefore(endMoment) && startMoment.isBefore(currEndMoment) ||
      currStartMoment.isSame(startMoment) ||
      currEndMoment.isSame(endMoment)) {
      overlaps.push(booking)
    };
  })

  return overlaps;
}

export const getMemberAttendance = async (email) => {
  try {
    const member = await membersCollection.findOne({ email, password: { $exists: true } })
    return {
      status: bookingsEnums.SUCCESSFUL_BOOKING_QUERY, attendances: bookingsCollection.find({ participants: { $in: [email] } })
    }
  }
  catch (err) {
    console.error(err);
    return {
      status: bookingsEnums.DATABASE_OPERATION_ERROR, attendances: []
    }
  }
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
    if (hasOverlappingBookings(await bookingsCollection.find({ professorDatabaseId, professor, date }).toArray(), startMoment, endMoment), date, isRecurring) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

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
    if (hasOverlappingBookings(await bookingsCollection.find({ professorDatabaseId, professor, date }).toArray(), startMoment, endMoment), date, isRecurring) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

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

export const addParticipantToBookingService = async (meetingID, email) => {
  try {
    const booking = await bookingsCollection.findOne({ meetingID });

    if (!booking) {
      return { status: bookingsEnums.BOOKING_NOT_FOUND, message: "Booking not found" };
    }

    if (booking.participants.includes(email)) {
      return { status: bookingsEnums.PARTICIPANT_ALREADY_ADDED, message: "User is already a participant" };
    }

    booking.participants.push(email);

    await bookingsCollection.updateOne({ meetingID }, { $set: { participants: booking.participants } });

    return { status: bookingsEnums.SUCCESSFUL_BOOKING_UPDATE, message: "Participant added successfully" };
  }
  catch (err) {
    console.error(err);
    return { status: bookingsEnums.DATABASE_OPERATION_ERROR, message: "Failed to add participant" };
  }
};

export const editBookingService = async (bookingId, professorDatabaseId, professor, date, startTime, endTime, isRecurring) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;

    const previousBooking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
    const overlappingBookings = overlappingBookingsList(await bookingsCollection.find({ professorDatabaseId, professor, date }).toArray(), startMoment, endMoment, date, isRecurring);

    if ((overlappingBookings.length > 1) ||
      (overlappingBookings.length == 1 && previousBooking.date === date && bookingId !== previousBooking._id.toString()) ||
      (overlappingBookings.length != 0 && previousBooking.date !== date)) {
      return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;
    }

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
  }
  catch (err) {
    console.error(err);
    return {
      status: bookingsEnums.DATABASE_OPERATION_ERROR,
      requestId: ""
    };
  }
}
