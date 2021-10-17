const express = require('express');
const { Sequelize, sequelize } = require('./dataSource/models');
const { jsonRespHandler } = require('./utilities/responseHandler');

const app = express();
const port = process.env.REST_API_PORT;

app.get('/', async (req, res) => {
  return await jsonRespHandler(req, res)
    .execute(props => {
      // throw({code: 500, message: 'na daot'})
      // throw({code: 404, message: 'na daot'})
      return {processresult: 'response data'}
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