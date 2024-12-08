import { Router } from 'express'

import database from '../database/connectMembersDatabase.js';

const bookingsCollectioon = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);

const bookingsRouter = Router();
