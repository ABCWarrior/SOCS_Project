import express from 'express';
import { config } from 'dotenv';
config({ path: '../.env' });

import loginRouter from './routes/loginRoutes.js';
import membersRouter from './routes/membersRoute.js';
import usersRouter from './routes/usersRoute.js';

const app = express();
const port = process.env.BACKEND_PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(('Hello World!'));
})

app.use('/login', loginRouter);
app.use('/members', membersRouter);
app.use('/users', usersRouter);
app.use((req, res) => {
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`BookMyProf listening at http://localhost:${port}`);
});
