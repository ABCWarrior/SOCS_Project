import moment from 'moment';

import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION)
const requestAppointmentsCollection = database.collection(process.env.MONGO_REQUEST_APPOINTMENTS_COLLECTION);

const hasOverlappingBookings = (bookings, startMoment, endMoment) => {
  const overlaps = bookings.map(({ docStartTime, docEndTime }) => {
    if (moment(docStartTime, "HH:mm", true).isBefore(endMoment) && startMoment.isBefore(moment(docEndTime, "HH:mm", true))) return [docStartTime, docEndTime];
  })

  return overlaps.length == 0 || overlaps != undefined ? false : true;
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

export const getAllBookingsService = async (professorDatabaseId) => {
  try {
    return { status: bookingsEnums.SUCCESSFUL_BOOKING_QUERY, all_bookings: await bookingsCollection.find({ professorDatabaseId }).toArray() }
  }
  catch (err) {
    console.error(err);
    return { status: bookingsEnums.DATABASE_OPERATION_ERROR, all_bookings: [] };
  }
}
export const createBookingService = async (professorDatabaseId, professorName, date, startTime, endTime) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;
    if (hasOverlappingBookings(await bookingsCollection.find({ professorDatabaseId, date }).toArray(), startMoment, endMoment)) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    const insertionResult = await bookingsCollection.insertOne({ professorDatabaseId, professorName, date, startTime, endTime });
    return { status: bookingsEnums.SUCCESSFUL_BOOKING_CREATION, bookingCode: insertionResult.insertedId.toString() };
  }
  catch (err) {
    console.error(err);
    return { status: bookingsEnums.DATABASE_OPERATION_ERROR, bookingCode: "" };
  }
}

export const editBookingService = async (professorDatabaseId, professor, date, startTime, endTime) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment, isBefore(endMoment)) {
      return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;
    }

    const query = {
      professorDatabaseId,
      date,
      $and: [{ startTime: { $lt: endMoment.newDate() }, endTime: { $gt: startMoment.newDate() } }]
    }
    const overlappingBookings = await bookingsCollection.find(query).toArray();

    if (overlappingBookings == 0) return bookingsEnums.BOOKINGS_NOT_FOUND_ERROR;
    if (overlappingBookings > 1) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    await bookingsCollection.updateOne(overlappingBookings[0]._id, { professorDatabaseId, professor, date, startMoment, endMoment });
    return bookingsEnums.SUCCESSFUL_BOOKING_EDIT;
  }
  catch (err) {
    console.error(err);
    return bookingsEnums.DATABASE_OPERATION_ERROR;
  }
}

export const deleteBookingService = async (professorDatabaseId, professor, date, startTime, endTime) => {
  try {
    const startMoment = moment(startTime, "HH:mm:ss", true);
    const endMoment = moment(endTime, "HH:mm:ss", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) {
      return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;
    }

    await bookingsCollection.deleteOne({ professorDatabaseId, professor, date, startTime: startMoment, endTime: endMoment });
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
