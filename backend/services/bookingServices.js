import moment from 'moment';

import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION)
const requestAppointmentsCollection = database.collection(process.env.MONGO_REQUEST_APPOINTMENTS_COLLECTION);

const hasOverlappingBookings = (bookings, startMoment, endMoment) => {
  const overlaps = []
  bookings.forEach(({ startTime, endTime }) => {
    if (moment(startTime, "HH:mm", true).isBefore(endMoment) && startMoment.isBefore(moment(endTime, "HH:mm", true))) overlaps.push[docStartTime, docEndTime];
  })
  console.log(overlaps);//test
  return overlaps.length == 0 || overlaps == undefined ? false : true;
}

const overlappingBookingsList = (bookings, startMoment, endMoment) => {
  const overlaps = [];
  bookings.forEach(({ startTime, endTime, _id }) => {
    if (moment(startTime, "HH:mm", true).isBefore(endMoment) && startMoment.isBefore(moment(endTime, "HH:mm", true))) overlaps.push(_id);
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
            ...booking, url: `${protocol}://${host}/${booking._id}`
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

export const editBookingService = async (professorDatabaseId, professor, date, startTime, endTime, isRecurring) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;

    const overlapsId = overlappingBookingsList(await bookingsCollection.find({ professorDatabaseId, professor, date }).toArray(), startMoment, endMoment);
    console.log(overlapsId);//test
    if (overlapsId.length != 1) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    await bookingsCollection.updateOne({ _id: overlapsId[0] }, { $set: { professorDatabaseId, professor, date, startTime, endTime, isRecurring } });
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

    await bookingsCollection.deleteOne({ professorDatabaseId, professor, date, startTime, endTime });
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
