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
    const attendances = await bookingsCollection.find({ 
      participants: { $in: [email] } 
    }).toArray()

    const cleanedAttendances = attendances.map(attendance => ({
      _id: attendance._id,
      professorDatabaseId: attendance.professorDatabaseId,
      professor: attendance.professor,
      date: attendance.date,
      startTime: attendance.startTime,
      endTime: attendance.endTime,
      isRecurring: attendance.isRecurring,
      participants: attendance.participants,
    }))
    
    console.log(cleanedAttendances)

    return {
      status: bookingsEnums.SUCCESSFUL_BOOKING_QUERY,
      attendances: cleanedAttendances
    }
  }
  catch (err) {
    console.error(err);
    return {
      status: bookingsEnums.DATABASE_OPERATION_ERROR,
      attendances: []
    }
  }
}