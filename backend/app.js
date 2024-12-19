import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from 'dotenv';
config({ path: '../.env' });

import loginRouter from './routes/loginRoutes.js';
import membersRouter from './routes/membersRoute.js';
import guestsRouter from './routes/guestsRoute.js';
import bookingsRouter from './routes/bookingsRoute.js';

const app = express();
const hostname = process.env.HOSTNAME; // change hostname as necessary
const port = process.env.BACKEND_PORT;

app.use(express.static('../frontend/build'));

app.use(cors({
  origin: 'http://127.0.0.1:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'token', 'email'],
  credentials: true
}));

app.use(express.json());

app.get('/api', (req, res) => {
  res.send(('Landing Page!'));
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../frontend/build', 'index.html'));
});

app.use('/api/login', loginRouter);
app.use('/api/members', membersRouter);
app.use('/api/guests', guestsRouter);
app.use('/api/bookings', bookingsRouter);
app.use((req, res) => {
  res.redirect('/')
});

app.listen(port, hostname, () => {
  console.log(`BookMyProf listening at http://${hostname}:${port}`);
});
