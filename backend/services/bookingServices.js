import moment from 'moment';
import { ObjectId } from 'mongodb';

import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';
import sendAutomatedEmail from './emailService.js';

const membersCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION);
const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION)
const requestAppointmentsCollection = database.collection(process.env.MONGO_REQUEST_APPOINTMENTS_COLLECTION);

const DAYS_OF_THE_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const hasOverlappingBookings = (bookings, startMoment, endMoment, date, isRecurring) => {
  const overlaps = [];

  bookings.forEach((booking) => {
    const currStartMoment = moment(booking.startTime, "HH:mm", true);
    const currEndMoment = moment(booking.endTime, "HH:mm", true);
    const newDate = date;
    const currDate = booking.date;
    const isNewDateADayOfTheWeek = DAYS_OF_THE_WEEK.includes(newDate);
    const isCurrDateADayOfTheWeek = DAYS_OF_THE_WEEK.includes(currDate);

    if (isNewDateADayOfTheWeek && isCurrDateADayOfTheWeek && (DAYS_OF_THE_WEEK[newDate] !== DAYS_OF_THE_WEEK[currDate])) return;
    else if (isNewDateADayOfTheWeek && !isCurrDateADayOfTheWeek) {
      const tempDate = new Date(currDate);
      if (DAYS_OF_THE_WEEK[tempDate.getDay()] !== newDate) return;
    }
    else if (!isNewDateADayOfTheWeek && isCurrDateADayOfTheWeek) {
      const tempDate = new Date(newDate);
      if (DAYS_OF_THE_WEEK[tempDate.getDay()] !== currDate) return;
    }
    else if (newDate !== currDate) return;

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
    const newDate = date;
    const currDate = booking.date;
    const isNewDateADayOfTheWeek = DAYS_OF_THE_WEEK.includes(newDate);
    const isCurrDateADayOfTheWeek = DAYS_OF_THE_WEEK.includes(currDate);

    if (isNewDateADayOfTheWeek && isCurrDateADayOfTheWeek && (DAYS_OF_THE_WEEK[newDate] !== DAYS_OF_THE_WEEK[currDate])) return;
    else if (isNewDateADayOfTheWeek && !isCurrDateADayOfTheWeek) {
      const tempDate = new Date(currDate);
      if (DAYS_OF_THE_WEEK[tempDate.getDay()] !== newDate) return;
    }
    else if (!isNewDateADayOfTheWeek && isCurrDateADayOfTheWeek) {
      const tempDate = new Date(newDate);
      if (DAYS_OF_THE_WEEK[tempDate.getDay()] !== currDate) return;
    }
    else if (newDate !== currDate) return;

    if (currStartMoment.isBefore(endMoment) && startMoment.isBefore(currEndMoment) ||
      currStartMoment.isSame(startMoment) ||
      currEndMoment.isSame(endMoment)) {
      overlaps.push(booking)
    };
  })

  return overlaps;
}

// To request all your attendances!
export const getMemberAttendance = async (email) => {
  console.log("Being Reached")
  try {
    // Ensure the member exists
    const member = await membersCollection.findOne({ email, password: { $exists: true } });
    if (member) {
      // Get the attendances with all booking details
      const attendances = await bookingsCollection.find({ 
        participants: { $in: [email] } 
      }).toArray();

      // Clean the booking objects to avoid circular references
      const cleanedAttendances = attendances.map(attendance => ({
        _id: attendance._id,
        professorDatabaseId: attendance.professorDatabaseId,
        professor: attendance.professor,
        date: attendance.date,
        startTime: attendance.startTime,
        endTime: attendance.endTime,
        isRecurring: attendance.isRecurring,
        participants: attendance.participants,
      }));

      return {
        status: bookingsEnums.SUCCESSFUL_BOOKING_QUERY,
        attendances: cleanedAttendances
      };
    }
    return {
      status: bookingsEnums.MEMBER_NOT_FOUND,
      attendances: []
    };
  }
  catch (err) {
    console.error(err);
    return {
      status: bookingsEnums.DATABASE_OPERATION_ERROR,
      attendances: []
    };
  }
};
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
    if (hasOverlappingBookings(await bookingsCollection.find({ professorDatabaseId, professor }).toArray(), startMoment, endMoment, date, isRecurring)) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

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
    if (hasOverlappingBookings(await bookingsCollection.find({ professorDatabaseId, professor }).toArray(), startMoment, endMoment, date, isRecurring)) return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;

    const insertionResult = await bookingsCollection.insertOne({ professorDatabaseId, professor, date, startTime, endTime, isRecurring, participants: [email] });
    await sendAutomatedEmail(`${professor} Has Accepted Your Appointment Request`,
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
    console.log(meetingID)

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(meetingID) });

    console.log(booking);

    if (!booking) {
      return { status: bookingsEnums.BOOKING_NOT_FOUND, message: "Booking not found" };
    }

    if (!booking.participants) {
      booking.participants = [];
    }

    if (booking.participants.includes(email)) {
      return { status: bookingsEnums.PARTICIPANT_ALREADY_ADDED, message: "User is already a participant" };
    }

    booking.participants.push(email);

    await bookingsCollection.updateOne(
      { _id: new ObjectId(meetingID) },
      { $set: { participants: booking.participants } }
    );

    return { status: bookingsEnums.SUCCESSFUL_BOOKING_UPDATE, message: "Participant added successfully" };
  } catch (err) {
    console.error(err);
    return { status: bookingsEnums.DATABASE_OPERATION_ERROR, message: "Failed to add participant" };
  }
};


export const editBookingService = async (professorDatabaseId, bookingId, professor, date, startTime, endTime, isRecurring) => {
  try {
    const startMoment = moment(startTime, "HH:mm", true);
    const endMoment = moment(endTime, "HH:mm", true);

    if (!startMoment.isValid() || !endMoment.isValid() || !startMoment.isBefore(endMoment)) {
      console.log("here 1")
      return bookingsEnums.WRONG_SCHEDULE_DATA_ERROR;}

    const previousBooking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
    const overlappingBookings = overlappingBookingsList(await bookingsCollection.find({ professorDatabaseId, professor }).toArray(), startMoment, endMoment, date, isRecurring);

    if ((overlappingBookings.length > 1) ||
      (overlappingBookings.length == 1 && previousBooking.date === date && bookingId !== previousBooking._id.toString()) ||
      (overlappingBookings.length != 0 && previousBooking.date !== date)) {
      return bookingsEnums.OVERLAPPING_SCHEDULE_ERROR;
    }

    await bookingsCollection.updateOne({ _id: previousBooking._id }, { $set: { professorDatabaseId, professor, date, startTime, endTime, isRecurring } });

    sendAutomatedEmail(`Booking Time Change for ${professor}`,
      `This is a notice that the booking with ${professor} which was during ${previousBooking.date} from ${previousBooking.startTime} to ${previousBooking.endTime} 
          has been changed to ${date} from ${startTime} to ${endTime} and ${isRecurring ? "is" : "is not"} recurring. \n
        Please sign up again to the booking with id ${previousBooking._id}`,
      previousBooking.participants);

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
    const appointmentRequests = await requestAppointmentsCollection.find({ "requestedAppointment.professorDatabaseId": professorDatabaseId }).toArray()
    return appointmentRequests;
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
