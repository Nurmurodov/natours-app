const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  console.log("handleCastErrorDB");
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message,400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log('ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

};

module.exports = ((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err}
    console.log("This is what I want to look",error);
    if(error.name === "CastError") error = handleCastErrorDB(error)
    sendErrorProd(error, res);
  }
});