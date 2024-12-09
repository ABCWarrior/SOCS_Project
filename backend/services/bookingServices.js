import moment from 'moment';

import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION)
const requestAppointmentsCollection = database.collection(process.env.MONGO_REQUEST_APPOINTMENTS_COLLECTION);

export const createBookingService = async (professorName, date, startTime, endTime) => {
  try {
    const startMoment = moment(startTime, "HH:mm:ss", true);
    const endMoment = moment(endTime, "HH:mm:ss", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment, isBefore(endMoment)) {
      return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;
    }

    const query = {
      $and: [{ startTime: { $lt: endMoment.newDate() }, endTime: { $gt: startMoment.newDate() } }]
    }
    const overlappingBookings = await bookingsCollection.find(query).toArray();

    if (overlappingBookings.length != 0) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    await bookingsCollection.insertOne({ professorName, date, startTime: startMoment, endTime: endMoment });
    return bookingsEnums.SUCCESSFUL_BOOKING_CREATION;
  }
  catch (err) {
    console.error(err);
    return bookingsEnums.DATABASE_OPERATION_ERROR;
  }
}

export const editBookingService = async (professorName, date, startTime, endTime) => {
  try {
    const startMoment = moment(startTime, "HH:mm:ss", true);
    const endMoment = moment(endTime, "HH:mm:ss", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment, isBefore(endMoment)) {
      return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;
    }

    const query = {
      $and: [{ startTime: { $lt: endMoment.newDate() }, endTime: { $gt: startMoment.newDate() } }]
    }
    const overlappingBookings = await bookingsCollection.find(query).toArray();

    if (overlappingBookings == 0) return bookingsEnums.BOOKINGS_NOT_FOUND_ERROR;
    if (overlappingBookings > 1) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    await bookingsCollection.updateOne(overlappingBookings[0]._id, { professorName, date, startMoment, endMoment })
    return bookingsEnums.SUCCESSFUL_BOOKING_EDIT;
  }
  catch (err) {
    console.error(err);
    return bookingsEnums.DATABASE_OPERATION_ERROR;
  }
}

export const getAllAppointmentRequests = async (id) => {
  try {
    return await requestAppointmentsCollection.find({ 'requestedAppointment.profId': id }).toArray();
  }
  catch (err) {
    console.log(err)
    return []
  }
}
