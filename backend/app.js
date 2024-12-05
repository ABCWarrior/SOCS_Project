require('dotenv').config({ path: '../.env' });

const express = require('express')
const app = express();
const port = process.env.BACKEND_HOST;

app.get('/', (req, res) => {
  res.send(('Hello World!'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
