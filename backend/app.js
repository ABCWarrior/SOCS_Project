import express from 'express';
import { config } from 'dotenv';
config({ path: '../.env' });

import loginRouter from './routes/loginRoutes.js';
import membersRouter from './routes/membersRoute.js';
import guestsRouter from './routes/guestsRoute.js';
import bookingsRouter from './routes/bookingsRoute.js';

const app = express();
const hostname = process.env.HOSTNAME; // change hostname as necessary
const port = process.env.BACKEND_PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(('Landing Page!'));
})

app.use('/login', loginRouter);
app.use('/members', membersRouter);
app.use('/guests', guestsRouter);
app.use('/bookings', bookingsRouter);
app.use((req, res) => {
  res.redirect('/')
});

app.listen(port, hostname, () => {
  console.log(`BookMyProf listening at http://${hostname}:${port}`);
});
