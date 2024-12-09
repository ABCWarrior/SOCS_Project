import { Router } from 'express'

import database from '../database/connectDatabase.js';

const bookingsCollectioon = database.collection(process.env.MONGO_BOOKINGS_COLLECTION);

const bookingsRouter = Router();

bookingsRouter.post

