require('dotenv').config()

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Sequelize, sequelize } = require('./dataSource/models');
const { jsonRespHandler } = require('./utilities/responseHandler');
const appRoutes = require('./controllers');

const port = process.env.APP_PORT;

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(appRoutes);


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