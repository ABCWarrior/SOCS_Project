import database from '../database/connectDatabase.js';
import { bookingEnums } from '../enums/bookingsEnums.js';

const bookingsCollection = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);
const requestAppointmentCollection = database.collection(process.env.MONGO_REQUEST_APPOINTMENTS_COLLECTION);

L
