const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('test main')
})

app.listen(port, () => {
  console.log(`App is listening at port ${ port }`)
})