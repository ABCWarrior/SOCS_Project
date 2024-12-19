import database from '../database/connectDatabase.js';
import { bookingsEnums } from '../enums/bookingsEnums.js';
const membersCollection = database.collection(process.env.MONGO_MEMBERS_COLLECTION);
const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);

export const getGuestAttendance = async (email) => {
  try {
    const member = await membersCollection.findOne({ email, password: { $exists: true } })

    if (member) {
      return {
        status: bookingsEnums.ACCOUNT_EXISTS,
        message: "This email is associated with an account. Please login to access your bookings."
      }
    }

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