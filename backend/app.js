import express from 'express'
import { config } from 'dotenv'
config({ path: '../.env' });

import loginRouter from './routes/loginRoutes.js'
import membersRouter from './routes/membersRoute.js'


const app = express();
const port = process.env.PORT;

app.use(express.json())

app.get('/', (req, res) => {
  res.send(('Hello World!'));
})

app.use('/login', loginRouter)
app.use('/members', membersRouter)
app.use((req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
