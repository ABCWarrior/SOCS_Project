import { Router } from 'express';

import { privatePageAuthentification } from '../authentification/tokenAuthentification.js';

const membersRouter = Router();

membersRouter.post('/:id/dashboard', async (req, res) => {
  privatePageAuthentification(req, res, "Dashboard");
})

membersRouter.post('/:id/edit_booking', async (req, res) => {
  privatePageAuthentification(req, res, "Edit Booking");
})

membersRouter.post('/:id/create_booking', async (req, res) => {
  privatePageAuthentification(req, res, "Create Booking");
})

membersRouter.post('/:id/confirm_appointments', async (req, res) => {
  privatePageAuthentification(req, res, "Confrim Appointments");
})

export default membersRouter
