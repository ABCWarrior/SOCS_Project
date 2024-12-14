import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);

export const getGuestAttendance = (email) => {
  try {
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

