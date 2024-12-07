import express from 'express'
import { config } from 'dotenv'

import loginRouter from './routes/loginRoutes.js'

config({ path: '../.env' });

const app = express();
const port = process.env.BACKEND_PORT;

app.use(express.json())

app.get('/', (req, res) => {
  res.send(('Hello World!'));
})

app.use('/login', loginRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
