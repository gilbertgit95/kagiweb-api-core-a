require('dotenv').config()

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Sequelize, sequelize } = require('./dataSource/models');
const { jsonRespHandler } = require('./utilities/responseHandler');

const port = process.env.APP_PORT;

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:mainRoute', async (req, res) => {
  return await jsonRespHandler(req, res)
    .execute(props => {
      // throw({code: 500, message: 'na daot'})
      // throw({code: 404, message: 'na daot'})
      return {processResult: 'response data', props}
    })
})

app.post('/postTest/:endRoute', async (req, res) => {
  return await jsonRespHandler(req, res)
    .execute(props => {
      // throw({code: 500, message: 'na daot'})
      // throw({code: 404, message: 'na daot'})
      return {processResult: 'response data', props}
    })
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