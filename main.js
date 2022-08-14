require('dotenv').config()

const initCronJobs = require('./cronJobs')

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, Log } = require('./dataSource/models');
const restapi = require('./controllers/restapi');
const graphql = require('./controllers/graphql');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(restapi);
app.use(graphql);

app.listen(port, async () => {
  // express log
  console.log(`App is listening at port ${ port }`)

  try {
    // db connection test
    await sequelize.authenticate()
    console.info('Database connected.')

  } catch (err) {
    console.error('Unable to connect to the database:', err)
  }

})

// initialize cron jobs
initCronJobs()