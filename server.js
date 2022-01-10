const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./router');
const AppError = require('./utilsAppError');

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// mount router
app.use('/api', indexRouter);

// handling errors
app.use((err, req, res, next) => {
  // console.log();
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  res.status(err.statusCode).json({
    message: err.message,
  });
});

// Handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on port ${port}...`));
