const express = require('express');
const rateLimit = require('express-rate-limit')
const morgan = require('morgan');

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();

// 1) Global Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 1000,
  windowMs: 60*60*1000,
  message: "Too many request from this IP, please try again in an hour!"
})

app.use('/api',limiter)

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', ((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`),404);
}));

app.use(globalErrorHandler);

// 4) create server

module.exports = app;