const express = require('express');
const { Sequelize, sequelize } = require('./dataSource/models');

const app = express();
const port = process.env.REST_API_PORT;

app.get('/', (req, res) => {
  res.send('test main')
})

app.listen(port, () => {
  // express log
  console.log(`App is listening at port ${ port }`)

  // db connection test
  sequelize
    .authenticate()
    .then(() => {
      console.info('Database connected.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })
})