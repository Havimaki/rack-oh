const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes/v1');
const ApiError = require('./utils/ApiError');

const app = express();
const port = process.env.PORT || 5000;

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});


app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`)
});

module.exports = app;
